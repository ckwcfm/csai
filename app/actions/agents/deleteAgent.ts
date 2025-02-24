'use server'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteAgent(agentId: number) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const agent = await db.agent.delete({
    where: {
      id: agentId,
      userId: session.user.id,
    },
  })

  revalidatePath('/agents')
}
