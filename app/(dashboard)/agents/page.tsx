import { getAgentsForUser } from '@/app/actions/agents/getAgentsForUser'
import { Skeleton } from '@/components/ui/skeleton'
import { DiamondPlusIcon } from 'lucide-react'
import { Suspense } from 'react'
import CreateAgentDialog from './_components/CreateAgentDialog'
import AgentCard from './_components/AgentCard'
import { getModels } from '@/app/actions/models/getModels'
import { Model } from '@prisma/client'
import { AgentIcon } from '@/components/icons/AgentIcon'
async function AgentsPage() {
  const models = await getModels()

  return (
    <div className='flex flex-col gap-4'>
      <AgentsHeader models={models} />
      <div className='flex flex-col gap-2 container'>
        <Suspense fallback={<AgentLoadingSkeleton />}>
          <AgentsList models={models} />
        </Suspense>
      </div>
    </div>
  )
}

function AgentsHeader({ models }: { models: Model[] }) {
  return (
    <div className='flex gap-2 items-center justify-between container'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2 text-2xl font-bold'>
          <AgentIcon />
          <h1 className='font-bold'>Agents</h1>
        </div>
        <p className='text-sm text-muted-foreground'>Manage your agents here</p>
      </div>
      <CreateAgentDialog models={models} />
    </div>
  )
}

async function AgentsList({ models }: { models: Model[] }) {
  const agents = await getAgentsForUser()
  if (agents.length === 0) {
    return <EmptyAgentsList models={models} />
  }
  return (
    <div className='flex flex-col gap-2'>
      {agents.map((agent) => (
        <div key={agent.id}>
          <AgentCard agent={agent} />
        </div>
      ))}
    </div>
  )
}

async function EmptyAgentsList({ models }: { models: Model[] }) {
  return (
    <div className='flex flex-col gap-4 items-center justify-center h-full'>
      <div className='bg-primary/10 rounded-full p-4'>
        <DiamondPlusIcon className='w-10 h-10 text-primary' />
      </div>
      <div className='flex flex-col text-center items-center justify-center'>
        <p className='text-primary font-bold text-2xl'>No agent created yet</p>
        <p className='text-sm text-muted-foreground'>
          Click the button below to create your first agent
        </p>
      </div>
      <CreateAgentDialog
        triggerTitle='Create your first agent'
        models={models}
      />
    </div>
  )
}

function AgentLoadingSkeleton() {
  return (
    <div className='flex flex-col gap-4'>
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className='h-24 w-full' />
      ))}
    </div>
  )
}

export default AgentsPage
