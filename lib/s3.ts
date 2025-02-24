import { env } from './env'
import { S3Client } from '@aws-sdk/client-s3'

export const s3Client = new S3Client({
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
})
