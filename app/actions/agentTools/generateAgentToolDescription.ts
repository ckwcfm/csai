'use server'
import { db } from '@/lib/db'
import { generatePDFSummary } from '@/lib/file/fileEmbeding'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'

type TGenerateSearchPDFToolDescription = {
  fileIds: number[]
}

export async function generateSearchPDFToolDescription(
  data: TGenerateSearchPDFToolDescription
) {
  const { fileIds } = data
  const files = await db.file.findMany({
    where: {
      id: { in: fileIds },
    },
  })
  if (files.length !== fileIds.length) {
    throw new Error('File not found')
  }
  const summaries = []
  for (const file of files) {
    let summary = file.summary
    if (!summary) {
      const result = await generatePDFSummary(file.id)
      summary = result.toString()
    }
    summaries.push(summary)
  }

  const model = new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0,
  })

  const prompt = ChatPromptTemplate.fromTemplate(
    `You are a helpful assistant that generates a description for a search PDF tool. The description should be in less than 100 words. Based on the following summaries, generate a description for the search PDF tool so that the AI agent knows when to use this tool. 
    SUMMARIES:
    {summaries}
    `
  )

  const description = await prompt.pipe(model).invoke({
    summaries: summaries.join('\n'),
  })
  console.log('DEBUG: Description:', description)
  return description.content.toString()
}
