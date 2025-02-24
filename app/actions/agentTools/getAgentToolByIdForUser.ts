import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export async function getAgentToolByIdForUser(agentToolId: number) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin')
  }

  const agentTool = await db.agentTool.findUnique({
    where: {
      id: agentToolId,
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
  if (!agentTool) {
    return null
  }
  return agentTool
}
