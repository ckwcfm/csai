import { AgentTool, AgentToolType, TAgentToolType } from '@/types/agentTool'
import { AgentQueryApiTool, AgentReadPDFTool } from './AgentQueryApiTool'

export const AgentToolRegistry = {
  QUERY_API: AgentQueryApiTool,
  PDF: AgentReadPDFTool,
} satisfies Record<TAgentToolType, AgentTool>
