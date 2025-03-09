'use server'
import { db } from '@/lib/db'
import bcrypt from 'bcrypt'

export const seedUser = async () => {
  const users = await db.user.findMany()
  if (users.length > 0) return

  await db.user.create({
    data: {
      id: 'cm6x8590q00002wnrvpgjrpzc',
      email: 'ckwcfm@gmail.com',
      password: bcrypt.hashSync('12345678', 10),
    },
  })
}

export const seedFile = async () => {
  const files = await db.file.findMany()
  if (files.length > 0) return

  await db.file.create({
    data: {
      id: 1,
      userId: 'cm6x8590q00002wnrvpgjrpzc',
      filename: 'Senior Frontend Developer - Ignition.pdf',
      key: 'cm6x8590q00002wnrvpgjrpzc/bbb2721c-0bf5-4ee4-b069-c9656606b385_Senior Frontend Developer - Ignition.pdf',
      contentType: 'application/pdf',
    },
  })

  await db.file.create({
    data: {
      id: 2,
      userId: 'cm6x8590q00002wnrvpgjrpzc',
      filename: 'iOS Engineer, Optimized Checkout Suite - Stripe.pdf',
      key: 'cm6x8590q00002wnrvpgjrpzc/9fe35f01-fb09-4d4a-be99-4fa64cb0c358_iOS Engineer, Optimized Checkout Suite - Stripe.pdf',
      contentType: 'application/pdf',
    },
  })
}

export const seedAgent = async () => {
  const agents = await db.agent.findMany()
  if (agents.length > 0) return

  await db.agent.create({
    data: {
      id: 1,
      name: 'Agent 1',
      description: 'Agent 1 Description',
      userId: 'cm6x8590q00002wnrvpgjrpzc',
      modelId: 1,
    },
  })
}

export const seedAgentTool = async () => {
  const agentTools = await db.agentTool.findMany()
  if (agentTools.length > 0) return

  await db.agentTool.create({
    data: {
      id: 1,
      name: 'Search PDF',
      description: 'Search PDF',
      type: 'SEARCH_PDF',
      userId: 'cm6x8590q00002wnrvpgjrpzc',
      searchPDFTool: {
        create: {
          files: {
            connect: { id: 1 },
          },
        },
      },
    },
  })
}
