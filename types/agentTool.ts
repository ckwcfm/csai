import { LucideProps } from 'lucide-react'
import { z } from 'zod'
import {
  CreateAgentPDFToolSchema,
  CreateAgentToolSchema,
  SearchPDFToolFormSchema,
  UpdateAgentPDFToolSchema,
} from '@/schemas/agentTool'
import { AgentSearchPDFTool, AgentTool, File } from '@prisma/client'
// export const AgentToolType = {
//   PDF: 'PDF',
//   QUERY_API: 'QUERY_API',
// } as const

// export type TAgentToolType = (typeof AgentToolType)[keyof typeof AgentToolType]

// export const AgentToolTypeLabels = {
//   PDF: 'Read PDF',
//   QUERY_API: 'Query API',
// } as const

// export type TCreateAgentTool = z.infer<typeof CreateAgentToolSchema>
export type TSearchPDFToolForm = z.infer<typeof SearchPDFToolFormSchema>
export type TCreateAgentPDFTool = z.infer<typeof CreateAgentPDFToolSchema>
export type TUpdateAgentPDFTool = z.infer<typeof UpdateAgentPDFToolSchema>

type TSearchPDFTool = AgentSearchPDFTool & {
  files: File[]
}

export type TAgentTool = AgentTool & {
  searchPDFTool: TSearchPDFTool | null
}
