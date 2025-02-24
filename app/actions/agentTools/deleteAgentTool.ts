'use server'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
export async function deleteAgentTool(toolId: number) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }

  const tool = await db.agentTool.delete({
    where: {
      id: toolId,
      userId: session.user.id,
    },
  })
  if (!tool) {
    throw new Error('Tool not found')
  }

  revalidatePath('/tools')
  return tool
}
