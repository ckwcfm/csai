'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  EllipsisVerticalIcon,
  PencilIcon,
  SearchIcon,
  TrashIcon,
} from 'lucide-react'
import { Agent, AgentsAgentTools, Model, AgentTool } from '@prisma/client'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { AgentIcon } from '@/components/icons/AgentIcon'
import DeleteAgentDialog from './DeleteAgentDialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'
type AgentCardProps = {
  agent: Agent & { model: Model } & {
    agentsAgentTools: (AgentsAgentTools & {
      agentTool: AgentTool
    })[]
  }
}

export default function AgentCard({ agent }: AgentCardProps) {
  const router = useRouter()
  return (
    <Card className='flex flex-col gap-2 border-separator border overflow-hidden items-start justify-center min-h-[80px] hover:bg-accent transition-all duration-300 shadow-none border-primary'>
      <CardContent className='flex flex-row gap-2 items-start w-full h-full py-4 group'>
        <div className='flex flex-col gap-2 items-start justify-start h-full w-full'>
          <AgentCardHeader className='w-full' agent={agent} />
          <div className='flex flex-col gap-1 w-full'>
            <div className='flex flex-col gap-1'>
              <div className='flex gap-4'>
                <div className='flex flex-row gap-2 items-center justify-start rounded-md text-xs px-2'>
                  <span className='text-primar font-semibold'>
                    {agent.model.name}
                  </span>

                  <span className='text-muted-foreground bg-primary/5 dark:bg-secondary/10 p-1 rounded-md px-2'>
                    {agent.model.credits} credits/request
                  </span>
                </div>
              </div>
            </div>

            <p className='text-sm flex-1 text-muted-foreground bg-primary/5 dark:bg-secondary/10 p-1 rounded-md px-2'>
              {agent.prompt}
            </p>
            <Separator className='w-full my-2' />
            <h1 className='text-sm font-semibold'>TOOLS</h1>
            <div className='flex flex-row gap-2 items-center justify-start'>
              {agent.agentsAgentTools.map((agentTool) => (
                <div
                  key={agentTool.agentToolId}
                  className='border-dotted border border-primary rounded-md px-2 py-1 text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-100'
                  onClick={() => {
                    router.push(`/tools/editor/${agentTool.agentToolId}`)
                  }}
                >
                  {agentTool.agentTool.type} : {agentTool.agentTool.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AgentCardHeader({
  agent,
  className,
}: {
  agent: Agent
  className?: string
}) {
  return (
    <div className={cn('flex flex-row gap-2', className)}>
      <div
        className={cn(
          'rounded-full p-2',
          agent.enabled
            ? 'bg-green-500/10 group-hover:bg-green-500/20 text-green-500'
            : 'bg-gray-500/10 group-hover:bg-gray-500/20 text-gray-500'
        )}
      >
        <AgentIcon disabled={!agent.enabled} size={16} />
      </div>
      <div className='flex flex-col gap-1 flex-1'>
        <p className='text-sm font-medium'>{agent.name}</p>
        <p className='text-xs text-muted-foreground'>{agent.description}</p>
      </div>
      <ActionButtons agent={agent} />
    </div>
  )
}

function ActionButtons({
  agent,
  className,
}: {
  agent: Agent
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-row gap-2 items-center justify-start',
        className
      )}
    >
      <Link
        className={cn(
          buttonVariants({ variant: 'outline', size: 'sm' }),
          'text-muted-foreground flex items-center gap-1 border-separator border-primary hover:bg-primary hover:text-primary-foreground'
        )}
        href={`/agents/editor/${agent.id}`}
      >
        <PencilIcon size={16} />
        Edit
      </Link>
      <DeleteAgentDialog
        className={cn(
          buttonVariants({ variant: 'outline', size: 'sm' }),
          'flex items-center gap-1 border-separator border-destructive hover:bg-destructive hover:text-destructive-foreground text-destructive'
        )}
        agentId={agent.id}
        agentName={agent.name}
      />
    </div>
  )
}
