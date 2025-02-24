'use server'

import { TUpdateAgentPDFTool } from '@/types/agentTool'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
export const updateAgentSearchPDFTool = async (data: TUpdateAgentPDFTool) => {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }

  const agentTool = await db.agentTool.update({
    where: { id: data.id, userId: session.user.id },
    data: {
      name: data.name,
      description: data.description,
      searchPDFTool: {
        delete: true,
        create: {
          files: { connect: data.files.map((file) => ({ id: file.id })) },
        },
      },
    },
    include: {
      searchPDFTool: {
        include: {
          files: true,
        },
      },
    },
  })

  revalidatePath('/tools')
  return agentTool
}
