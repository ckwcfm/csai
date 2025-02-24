'use server'

import { db } from '@/lib/db'
import { TUpdateAgentSchema } from '@/schemas/agent'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
export async function updateAgent(data: TUpdateAgentSchema) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }
  const agent = await db.agent.update({
    where: {
      id: data.id,
      userId: session.user.id,
    },
    data: {
      name: data.name,
      description: data.description,
      prompt: data.prompt,
      modelId: data.model,
      temperature: data.temperature,
      maxTokens: data.maxTokens,
      enabled: data.enabled,
      agentsAgentTools: {
        deleteMany: {},
        create: data.tools.map((tool) => ({
          agentToolId: tool.id,
        })),
      },
    },
  })

  revalidatePath('/agents')
  return agent
}
