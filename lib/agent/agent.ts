'use server'
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts'
import {
  BaseMessage,
  HumanMessage,
  AIMessage,
  SystemMessage,
} from '@langchain/core/messages'
import { db } from '../db'
import { getLangChainLLm, TSupportedModels } from '../llm/getLangChainLLm'
import { Agent, AgentTool, Model, AgentsAgentTools } from '@prisma/client'
import {
  AgentDateTool,
  AgentSearchPDFTool,
} from '../agentTools/AgentQueryApiTool'
import {
  Annotation,
  END,
  MemorySaver,
  MessagesAnnotation,
  messagesStateReducer,
  START,
  StateGraph,
  StateGraphArgs,
  type Messages,
} from '@langchain/langgraph'
import { ToolNode } from '@langchain/langgraph/prebuilt'
import { Message as VercelMessage } from 'ai'
const State = Annotation.Root({
  messages: Annotation<BaseMessage[], Messages>({
    reducer: messagesStateReducer,
  }),
  agentId: Annotation<number>,
  userId: Annotation<string>,
  messagesStream: Annotation<string>,
})

type TAgent = Agent & { model: Model } & {
  agentsAgentTools: (AgentsAgentTools & { agentTool: AgentTool })[]
}
const getAgent = async ({
  agentId,
  userId,
}: {
  agentId: number
  userId: string
}) => {
  const agent = await db.agent.findUnique({
    where: {
      id: agentId,
      userId,
    },
    include: {
      model: true,
      agentsAgentTools: {
        include: {
          agentTool: true,
        },
      },
    },
  })
  if (!agent) {
    throw new Error('Agent not found')
  }
  return agent
}

const composellm = async ({ agent }: { agent: TAgent }) => {
  const llm = getLangChainLLm(agent.model.name as TSupportedModels)
  return llm
}

const conposeAgentTools = async ({
  agent,
  userId,
}: {
  agent: TAgent
  userId: string
}) => {
  const agentTools = []
  for (const tool of agent.agentsAgentTools) {
    switch (tool.agentTool.type) {
      case 'SEARCH_PDF':
        const toolname = tool.agentTool.name
        const description = tool.agentTool.description
        agentTools.push(
          AgentSearchPDFTool({
            name: toolname,
            description,
            toolId: tool.agentTool.id,
            userId,
          })
        )
        break
      default:
        break
    }
  }
  const basicTools = [AgentDateTool()]
  return [...agentTools, ...basicTools]
}

const composePrompt = async ({
  agent,
  userId,
  tools,
}: {
  agent: TAgent
  userId: string
  tools: Awaited<ReturnType<typeof conposeAgentTools>>
}) => {
  const messages = [
    new SystemMessage(
      `You are a helpful assistant for user with useId ${userId}.
      You have access to the following tools: {tool_names}

      Make sure to use the tools to answer the user's question.
      
      `
    ),
    new SystemMessage(agent.prompt ?? ''),
  ]

  if (tools.length > 0) {
    messages.push(
      new SystemMessage(
        `
        You have access to the following tools: ${tools
          .map((tool) => tool.name)
          .join(', ')}
        `
      )
    )
  }

  const prompt = ChatPromptTemplate.fromMessages([
    ...messages,
    new MessagesPlaceholder('messages'),
  ])
  return prompt
}

const invokeModel = async (
  state: typeof State.State
): Promise<Partial<typeof State.State>> => {
  console.log('DEBUG: invokeModel messages | LINE: 141', state.messages)
  const agent = await getAgent({ agentId: state.agentId, userId: state.userId })
  const tools = await conposeAgentTools({ agent, userId: state.userId })
  const prompt = await composePrompt({
    agent,
    userId: state.userId,
    tools,
  })
  const llm = (await composellm({ agent })).bindTools(tools)
  const formattedPrompt = await prompt.formatMessages({
    messages: state.messages,
    tool_names: tools.map((tool) => tool.name),
  })

  const result = await llm
    .withConfig({
      tags: ['llm_inference'],
    })
    .invoke(formattedPrompt)

  return {
    messages: [result],
    agentId: state.agentId,
    userId: state.userId,
  }
}

function shouldContinue(state: typeof State.State) {
  console.log(`DEBUG: shouldContinue state ${new Date().toISOString()}`, state)

  const messages = state.messages
  const lastMessage = messages[messages.length - 1] as AIMessage
  if (lastMessage.tool_calls?.length) {
    console.log('DEBUG: shouldContinue | LINE: 153', 'tools')
    return 'tools'
  }
  return END
}

const composeWorkflow = async ({
  tools,
}: {
  tools: Awaited<ReturnType<typeof conposeAgentTools>>
}) => {
  const graph = new StateGraph(State)
  const toolNode = new ToolNode<typeof State>(tools)
  const agentCheckpointer = new MemorySaver()

  const workflow = graph
    .addNode('agent', invokeModel)
    .addNode('tools', toolNode)
    .addEdge(START, 'agent')
    .addEdge('tools', 'agent')
    .addConditionalEdges('agent', shouldContinue)

  const app = workflow.compile()
  return app
}

export async function invokeAgent({
  agentId,
  userId,
  messages,
}: {
  agentId: number
  userId: string
  messages: VercelMessage[]
}) {
  const agent = await getAgent({ agentId, userId })
  const tools = await conposeAgentTools({ agent, userId })
  const workflow = await composeWorkflow({
    tools,
  })
  const history = messages.map((message) => {
    if (message.role === 'user') {
      return new HumanMessage(message.content)
    }
    return new AIMessage(message.content)
  })
  // const lastMessage = messages[messages.length - 1]
  const resultStream = workflow.streamEvents(
    {
      messages: history,
      agentId,
      userId,
    },

    {
      configurable: { subgraphs: true },
      version: 'v2',
    }
  )

  return resultStream
}
