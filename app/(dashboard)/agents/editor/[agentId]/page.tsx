import React, { Suspense } from 'react'
import AgentEditor from '@/app/(dashboard)/agents/_components/AgentEditor'
import { getModels } from '@/app/actions/models/getModels'
import { getAgentByIdForUser } from '@/app/actions/agents/getAgentByIdForUser'
import { Separator } from '@/components/ui/separator'
import { getToolsForUser } from '@/app/actions/agentTools/getToolsForUser'
import { AgentSearchPDFTool, AgentTool, File } from '@prisma/client'
import { TAgentTool } from '@/types/agentTool'
import { cn } from '@/lib/utils'
import ToolCard from '@/app/(dashboard)/agents/_components/ToolCard'

type AgentEditorPageProps = {
  params: {
    agentId: number
  }
}

async function page({ params }: AgentEditorPageProps) {
  const agentId = Number(params.agentId)
  const models = await getModels()
  const agent = await getAgentByIdForUser(agentId)
  if (!agent) {
    return <div>Agent not found</div>
  }

  const tools = await getToolsForUser()

  return (
    <div className='flex flex-row h-full'>
      <Suspense>
        <AgentEditor
          className='h-full p-4 w-full'
          agent={agent}
          models={models}
        />
      </Suspense>
      <Separator orientation='vertical' />
      <Suspense>
        <ToolList
          className='h-full p-4 max-w-[280px] w-full shadow-md border-l border-primary/5 dark:border-primary/20'
          tools={tools}
        />
      </Suspense>
    </div>
  )
}

type TToolListProps = {
  tools: TAgentTool[]
  className?: string
}
function ToolList({ tools, className }: TToolListProps) {
  return (
    <div className={cn('flex flex-col gap-2 bg-primary/5 h-full', className)}>
      <div className='flex flex-row items-center gap-2'>
        <div className='flex flex-col gap-1'>
          <h3 className='text-sm font-medium'>Tools</h3>
          <p className='text-sm text-muted-foreground'>
            Add tools to the agent to enable it to use them.
          </p>
        </div>
      </div>
      <Separator />
      <div className='flex flex-col gap-2'>
        {tools.map((tool) => (
          <ToolCard
            className='p-2 px-4 rounded-md cursor-grab active:cursor-grabbing bg-text-foreground border-primary/50 border-dashed hover:border-primary border-2 hover:bg-primary/10'
            key={tool.id}
            tool={tool}
          />
        ))}
      </div>
    </div>
  )
}

export default page
