import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Next Auth
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),

  // OpenAI
  OPENAI_API_KEY: z.string().min(1),

  // AWS S3
  S3_ACCESS_KEY: z.string().min(1),
  S3_SECRET_KEY: z.string().min(1),
  S3_REGION: z.string().min(1),
  S3_BUCKET_NAME: z.string().min(1),

  // Optional
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
})

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

try {
  envSchema.parse(process.env)
} catch (err) {
  if (err instanceof z.ZodError) {
    const { fieldErrors } = err.flatten()
    const errorMessage = Object.entries(fieldErrors)
      .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
      .join('\n  ')
    throw new Error(`Missing environment variables:\n  ${errorMessage}`)
  }
}

export const env = process.env as z.infer<typeof envSchema>
