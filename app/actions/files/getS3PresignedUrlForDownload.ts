'use server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { s3Client } from '@/lib/s3'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export async function getS3PresignedUrlForDownload(fileId: number) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }
  const file = await db.file.findUnique({
    where: { id: fileId, userId: session.user.id },
  })
  if (!file) {
    throw new Error('File not found')
  }

  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: file.key,
  })
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 60 * 5,
  })
  return url
}
