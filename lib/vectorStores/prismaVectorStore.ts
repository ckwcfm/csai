import { PrismaVectorStore } from '@langchain/community/vectorstores/prisma'
import { OpenAIEmbeddings } from '@langchain/openai'
import { Prisma, FileEmbedding } from '@prisma/client'
import { db } from '../db'
const EMBEDDING_MODEL = 'text-embedding-3-small'

export function createPrismaVectorStore() {
  const vectorStore = PrismaVectorStore.withModel<FileEmbedding>(db).create(
    new OpenAIEmbeddings({
      model: EMBEDDING_MODEL,
    }),
    {
      prisma: Prisma,
      tableName: 'FileEmbedding',
      vectorColumnName: 'embedding',
      columns: {
        id: PrismaVectorStore.IdColumn,
        content: PrismaVectorStore.ContentColumn,
        fileId: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    }
  )
  return vectorStore
}
