import { tool } from '@langchain/core/tools'
import { z } from 'zod'
import { createPrismaVectorStore } from '../vectorStores/prismaVectorStore'
import { db } from '../db'

// * Base tool for all agent tools
export const AgentDateTool = () => {
  return tool(
    async () => {
      return new Date().toISOString()
    },
    {
      name: 'current_date',
      description: 'Get the current date',
    }
  )
}

// * Search PDF tool
// type TAgentSearchPDFToolResponse = {
//   fileId: number
//   userId: string
//   content: string
//   type: 'text'
// }[]

export const AgentSearchPDFTool = ({
  name,
  description,
  toolId,
  userId,
}: {
  name: string
  description: string
  toolId: bigint
  userId: string
}) => {
  return tool(
    async ({ query }: { query: string }) => {
      console.log('DEBUG: AgentSearchPDFTool | LINE: 39', query, userId)
      const tool = await db.agentTool.findUnique({
        where: {
          id: toolId,
        },
        select: {
          searchPDFTool: {
            select: {
              files: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      })
      if (!tool) {
        throw new Error('Tool not found')
      }
      const fileIds = tool.searchPDFTool?.files.map((file) => file.id) ?? []
      const vectorStore = createPrismaVectorStore()
      const results = await vectorStore.similaritySearch(query, 3, {
        userId: {
          equals: userId,
        },
        fileId: {
          in: fileIds,
        },
      })
      const content = results.map((result) => result.pageContent).join('\n')
      return [content, results]
    },
    {
      name,
      description,
      schema: z.object({
        query: z.string().describe('The query to search the PDF files'),
        userId: z.string().describe('The user id of the user'),
      }),
      responseFormat: 'content_and_artifact',
    }
  )
}
