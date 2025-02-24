'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { createFileSchema, TCreateFileSchema } from '@/schemas/file'
import { generatePDFSummary } from '@/lib/file/fileEmbeding'
export async function createFile(values: TCreateFileSchema) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }
  const { key, filename, contentType } = createFileSchema.parse(values)
  const file = await db.file.create({
    data: {
      key,
      filename,
      contentType,
      userId: session.user.id,
    },
  })
  revalidatePath('/files')
  return file
}
