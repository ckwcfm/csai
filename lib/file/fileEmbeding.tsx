'use server'

import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { db } from '@/lib/db'
import { authOptions } from '../auth'
import { getServerSession } from 'next-auth'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { getS3PresignedUrlForDownload } from '@/app/actions/files/getS3PresignedUrlForDownload'
import { revalidatePath } from 'next/cache'
import { SystemMessage } from '@langchain/core/messages'
const EMBEDDING_MODEL = 'text-embedding-3-small'
import { createPrismaVectorStore } from '../vectorStores/prismaVectorStore'

export async function generatePDFSummary(fileId: number) {
  const url = await getS3PresignedUrlForDownload(fileId)

  const model = new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0,
  })

  const blob = await fetchPDF(url)
  const loader = new WebPDFLoader(blob)
  const docs = await loader.load()
  const prompt1 = `
  You are a helpful assistant that summarizes PDFs.
  Summarize the following PDF:
  {docs}
  in less than 50 words
  `
  const prompt2 = `
  You are a helpful assistant that describes  PDFs.
  Describe the following PDF:
  {docs}
  in less than 50 words
  `
  const prompt = ChatPromptTemplate.fromTemplate(prompt1)

  const summary = await prompt.pipe(model).invoke({ docs })
  const summaryContent = summary.content.toString()
  await db.file.update({
    where: { id: fileId },
    data: { summary: summaryContent },
  })
  revalidatePath('/files')
  return summary.content
}

export async function fetchPDF(pdfUrl: string) {
  const response = await fetch(pdfUrl)
  const blob = await response.blob()
  return blob
}

// Function to load and split PDF from URL into chunks
export async function splitPDFIntoChunks(pdfUrl: string) {
  try {
    const blob = await fetchPDF(pdfUrl)
    // Load PDF from URL
    const loader = new WebPDFLoader(blob)
    const docs = await loader.load()

    // Split text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })

    const chunks = await splitter.splitDocuments(docs)
    return chunks.map((chunk) => chunk.pageContent)
  } catch (error) {
    console.error('Error splitting PDF:', error)
    throw error
  }
}

// Function to generate embeddings for chunks using OpenAI
export async function generateEmbeddings(chunks: string[]) {
  try {
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      model: EMBEDDING_MODEL,
    })

    const embeddingResults = await Promise.all(
      chunks.map((chunk) => embeddings.embedQuery(chunk))
    )

    return embeddingResults
  } catch (error) {
    console.error('Error generating embeddings:', error)
    throw error
  }
}

// Function to store embeddings in database using Prisma
export async function storeEmbeddings({
  fileId,
  chunks,
  userId,
}: {
  fileId: number
  chunks: string[]
  userId: string
}) {
  try {
    // remove old embeddings
    await db.fileEmbedding.deleteMany({
      where: {
        fileId,
        userId,
      },
    })

    const vectorStore = createPrismaVectorStore()

    await vectorStore.addModels(
      await db.$transaction(
        chunks.map((chunk) => {
          return db.fileEmbedding.create({
            data: { content: chunk, fileId, userId },
          })
        })
      )
    )
  } catch (error) {
    console.error('Error storing embeddings:', error)
    throw error
  }
}

// Main function to process PDF from URL
export async function processPDFDocument(fileId: number, pdfUrl: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      throw new Error('Unauthorized')
    }
    // Split PDF into chunks
    const chunks = await splitPDFIntoChunks(pdfUrl)
    console.log('DEBUG: Split PDF into chunks:', chunks)
    // Generate embeddings
    // const embeddings = await generateEmbeddings(chunks)
    // console.log('DEBUG: Generate embeddings:', embeddings)

    // Store in database
    await storeEmbeddings({ fileId, chunks, userId: session.user.id })
    revalidatePath('/files')
    return { success: true }
  } catch (error) {
    console.error('Error processing PDF:', error)
    throw error
  }
}

export async function searchEmbeddings({ query }: { query: string }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }
  const vectorStore = createPrismaVectorStore()
  const results = await vectorStore.similaritySearch(query, 3, {
    userId: {
      equals: session.user.id,
    },
  })

  console.log('DEBUG: Search embeddings:', results)

  const fileIds = Array.from(
    new Set(results.map((result) => result.metadata.fileId))
  )
  const files = await db.file.findMany({
    where: {
      id: {
        in: fileIds,
      },
    },
  })

  const docs = results
    .map((result) => {
      const file = files.find((file) => file.id === result.metadata.fileId)
      if (!file) {
        return null
      }
      return {
        content: result.pageContent.replaceAll('\n', ' ').slice(0, 100),
        filename: file.filename,
        fileId: file.id,
      }
    })
    .filter((doc) => doc !== null)
  console.log('DEBUG: Search embeddings:', docs)
  return docs
}
