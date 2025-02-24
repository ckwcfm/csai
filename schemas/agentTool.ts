import { z } from 'zod'

export const CreateAgentToolSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .regex(/^[a-zA-Z0-9-_]+$/, {
      message:
        'Name can only contain letters, numbers, - , _ , and no spaces, no special characters',
    }),
  description: z.string().min(1, { message: 'Description is required' }),
  type: z.string().min(1, { message: 'Type is required' }),
})

export const SearchPDFToolFormSchema = CreateAgentToolSchema.extend({
  type: z.literal('SEARCH_PDF'),
  files: z
    .array(
      z.object({
        id: z.number(),
        filename: z.string(),
      })
    )
    .min(1, { message: 'At least one file is required' }),
})
export const CreateAgentPDFToolSchema = SearchPDFToolFormSchema
export const UpdateAgentPDFToolSchema = CreateAgentPDFToolSchema.extend({
  id: z.bigint(),
})
