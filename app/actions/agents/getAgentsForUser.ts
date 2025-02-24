'use server'

import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

export async function getAgentsForUser() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return []
  }
  const agents = await db.agent.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      model: true,
      agentsAgentTools: {
        include: {
          agentTool: {
            include: {
              searchPDFTool: true,
            },
          },
        },
      },
    },
  })

  return agents
}
