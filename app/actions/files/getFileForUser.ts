'use server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function getFileForUser() {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }
  const files = await db.file.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      embeddings: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return files
}
