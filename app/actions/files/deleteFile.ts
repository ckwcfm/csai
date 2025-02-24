'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { s3Client } from '@/lib/s3'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'

export async function deleteFile(fileId: number) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }

  const file = await db.file.findUnique({
    where: {
      id: fileId,
      userId: session.user.id,
    },
  })
  if (!file) {
    throw new Error('File not found')
  }

  await db.fileEmbedding.deleteMany({
    where: {
      fileId: fileId,
    },
  })

  await db.file.delete({
    where: {
      id: fileId,
    },
  })

  await deleteFileFromS3(file.key)
  revalidatePath('/files')
  return { success: true }
}

async function deleteFileFromS3(key: string) {
  const client = s3Client
  const bucket = process.env.S3_BUCKET_NAME
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  )
  return true
}
