'use server'
import { db } from '@/lib/db'

export async function getModels() {
  const models = await db.model.findMany()
  return models
}
