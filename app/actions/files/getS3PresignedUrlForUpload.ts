'use server'

import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3Client } from '@/lib/s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'

export async function getS3PresignedUrlForUpload(
  filename: string,
  contentType: string
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }
  // call s3 for presigned url
  const randomId = crypto.randomUUID()
  const key = `${session.user.id}/${randomId}`
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  })
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 60 * 5,
  })
  return { url, key }
}
