import { openai } from '@ai-sdk/openai'
import {
  streamText,
  LangChainAdapter,
  Message,
  createDataStreamResponse,
} from 'ai'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { invokeAgent } from '@/lib/agent/agent'
import { BaseMessage, AIMessage } from '@langchain/core/messages'

export const maxDuration = 30

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 })
  }
  const userId = session.user.id
  const agent = await getUserFirstEnabledAgent(userId)
  if (!agent) {
    return new Response('No enabled agent found', { status: 404 })
  }

  const { messages } = await req.json()

  // TODO: may need to extract the last user message and pass it to the agent
  const formattedMessages = messages.map(formatMessage)
  const resultStream = await invokeAgent({
    agentId: agent.id,
    userId,
    messages: formattedMessages,
  })

  const stream = new ReadableStream({
    async start(controller) {
      for await (const { event, data, tags } of resultStream) {
        if (event === 'on_chat_model_stream') {
          if (data.chunk.content && !!tags && tags.includes('llm_inference')) {
            const chunk = data.chunk
            const aiMessage = convertLangChainMessageToVercelMessage(chunk)
            // console.log('DEBUG: aiMessage', aiMessage)
            controller.enqueue(aiMessage)
          }
        }
      }
      controller.close()
    },
  })

  return LangChainAdapter.toDataStreamResponse(stream)
}

function formatMessage(message: Message) {
  return {
    role: message.role,
    content: message.content,
  }
}

const getUserFirstEnabledAgent = async (userId: string) => {
  const agent = await db.agent.findFirst({
    where: {
      userId,
      enabled: true,
    },
    include: {
      model: true,
    },
  })

  return agent
}

/**
 * Converts a LangChain message to a Vercel message.
 * @param message - The message to convert.
 * @returns The converted Vercel message.
 */
export const convertLangChainMessageToVercelMessage = (
  message: BaseMessage
) => {
  switch (message.getType()) {
    case 'human':
      return { content: message.content, role: 'user' }
    case 'ai':
      return {
        content: message.content,
        role: 'assistant',
        tool_calls: (message as AIMessage).tool_calls,
      }
    default:
      return { content: message.content, role: message._getType() }
  }
}
