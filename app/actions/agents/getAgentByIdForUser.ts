'use server'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export async function getAgentByIdForUser(agentId: number) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin')
  }
  const agent = await db.agent.findUnique({
    where: {
      id: agentId,
      userId: session.user.id,
    },
    include: {
      agentsAgentTools: {
        include: {
          agentTool: true,
        },
      },
    },
  })
  if (!agent) {
    return null
  }
  return agent
}
