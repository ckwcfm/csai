'use server'

import { TCreateAgentPDFTool } from '@/types/agentTool'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { processPDFDocument } from '@/lib/file/fileEmbeding'
import { getS3PresignedUrlForDownload } from '../files/getS3PresignedUrlForDownload'

export const createAgentSearchPDFTool = async (data: TCreateAgentPDFTool) => {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }

  const agentTool = await db.agentTool.create({
    data: {
      name: data.name,
      description: data.description,
      type: data.type,
      userId: session.user.id,
      searchPDFTool: {
        create: {
          files: {
            connect: data.files.map((file) => ({ id: file.id })),
          },
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

  // do embeddings if the files have embeddings
  const filesWithEmbeddings = await db.file.findMany({
    where: {
      id: { in: data.files.map((file) => file.id) },
    },
    include: {
      embeddings: true,
    },
  })

  for (const file of filesWithEmbeddings) {
    if (file.embeddings.length === 0) {
      const url = await getS3PresignedUrlForDownload(file.id)
      await processPDFDocument(file.id, url)
    }
  }

  revalidatePath('/tools')
  return agentTool
}
