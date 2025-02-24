import { AgentToolType } from '@prisma/client'
import { z } from 'zod'

export const createAgentSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(20, {
    message: 'Name must be less than 20 characters',
  }),
  description: z.string().optional(),
  model: z.number(),
})

export type TCreateAgentSchema = z.infer<typeof createAgentSchema>

export const updateAgentSchema = createAgentSchema.extend({
  id: z.number(),
  prompt: z.string().optional(),
  model: z.number(),
  temperature: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe('temperature for the model, 0 is deterministic, 1 is random'),
  maxTokens: z
    .number()
    .min(1)
    .max(1000)
    .optional()
    .describe('max tokens for the model'),
  enabled: z.boolean().optional(),
  tools: z.array(
    z.object(
      {
        name: z.string({
          required_error: 'Name is required',
        }),
        description: z.string({
          required_error: 'Description is required',
        }),
        type: z.nativeEnum(AgentToolType, {
          required_error: 'Type is required',
        }),
        id: z.number({
          required_error: 'Id is required',
        }),
      },
      {
        required_error: 'Tools are required',
      }
    ),
    {
      required_error: 'Tools are required',
    }
  ),
})

export type TUpdateAgentSchema = z.infer<typeof updateAgentSchema>
