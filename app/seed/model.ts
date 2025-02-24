import { db } from '@/lib/db'
import { SUPPORTED_MODELS } from '@/lib/llm/getLangChainLLm'
import { Model } from '@prisma/client'

const modelCredits = {
  'gpt-4o': 10,
  'gpt-4o-mini': 5,
  'llama3.1:8b': 5,
} satisfies Record<(typeof SUPPORTED_MODELS)[number], number>

export const seedModel = async () => {
  const models = await db.model.findMany()
  const missingModels = SUPPORTED_MODELS.filter(
    (model) => !models.some((m) => m.name === model)
  )
  if (missingModels.length > 0) {
    await db.model.createMany({
      data: missingModels.map((model) => ({
        name: model as string,
        credits: modelCredits[model],
      })),
    })
  }
}
