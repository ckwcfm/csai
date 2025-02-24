'use server'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { wait } from '@/lib/wait'
import { getServerSession } from 'next-auth'

export async function getToolsForUser() {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }

  const tools = await db.agentTool.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      searchPDFTool: {
        include: {
          files: true,
        },
      },
    },
  })

  return tools
}
