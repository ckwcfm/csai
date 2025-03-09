import { z } from 'zod'

export const fileContentTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
] as const

export const fileContentTypesSchema = z.enum(fileContentTypes)
export type TFileContentType = z.infer<typeof fileContentTypesSchema>

export const fileSchema = z.object({
  id: z.number().optional(),
  filename: z.string(),
  key: z.string(),
  userId: z.string(),
  contentType: fileContentTypesSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type TFile = z.infer<typeof fileSchema>

export const createFileSchema = fileSchema.pick({
  filename: true,
  key: true,
  contentType: true,
})

export type TCreateFileSchema = z.infer<typeof createFileSchema>
