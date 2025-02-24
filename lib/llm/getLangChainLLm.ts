import { ChatOpenAI } from '@langchain/openai'
import { ChatOllama } from '@langchain/ollama'

export const SUPPORTED_MODELS_OPENAI = ['gpt-4o', 'gpt-4o-mini'] as const
export const SUPPORTED_MODELS_OLLAMA = ['llama3.1:8b'] as const

export const SUPPORTED_MODELS = [
  ...SUPPORTED_MODELS_OPENAI,
  ...SUPPORTED_MODELS_OLLAMA,
] as const

export type TSupportedModels = (typeof SUPPORTED_MODELS)[number]

export const getLangChainLLm = (model: (typeof SUPPORTED_MODELS)[number]) => {
  switch (model) {
    case 'gpt-4o':
      return new ChatOpenAI({ model: 'gpt-4o', temperature: 0 })
    case 'gpt-4o-mini':
      return new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 })
    case 'llama3.1:8b':
      return new ChatOllama({ model: 'llama3.1:8b', temperature: 0 })
    default:
      throw new Error(`Model ${model} not supported`)
  }
}
