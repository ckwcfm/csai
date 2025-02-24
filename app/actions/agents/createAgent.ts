'use server'

import { createAgentSchema, TCreateAgentSchema } from '@/schemas/agent'
import { z } from 'zod'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function CreateAgent(values: TCreateAgentSchema) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      throw new Error('Unauthorized')
    }
    const {
      name,
      description,
      model: modelId,
    } = createAgentSchema.parse(values)
    const model = await db.model.findUnique({
      where: {
        id: modelId,
      },
    })
    if (!model) {
      throw new Error('Model not found')
    }
    const agent = await db.agent.create({
      data: {
        name,
        description,
        userId: session.user.id,
        modelId,
      },
    })
    if (!agent) {
      throw new Error('Failed to create agent')
    }
    revalidatePath('/agents')
    redirect(`/agents/editor/${agent.id}`)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.message)
    }
    throw error
  }
}
