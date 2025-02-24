import { AgentToolRegistry } from '@/lib/agentTools/AgentToolRegistry'
import { CreatePDFToolCard } from './_components/CreateToolCards'
import { Separator } from '@/components/ui/separator'
import { AgentSearchPDFTool, AgentTool, File } from '@prisma/client'
import { getToolsForUser } from '@/app/actions/agentTools/getToolsForUser'
import { cn } from '@/lib/utils'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  MoreHorizontalIcon,
  MoreVerticalIcon,
  TrashIcon,
  WrenchIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Loading from './loading'
import ToolsSidebar from './_components/ToolsSidebar'
import { TAgentTool } from '@/types/agentTool'
import ToolCardActionMenu from './_components/ToolCardActionMenu'

async function page() {
  const tools = await getToolsForUser()
  return (
    <div className='flex min-h-full h-full'>
      <Suspense>
        <ToolsList className='flex-1 p-4 ' tools={tools} />
      </Suspense>
      <Separator orientation='vertical' className='h-full' />
      <ToolsSidebar />
    </div>
  )
}

function EmptyToolsList() {
  return (
    <div className='flex flex-col gap-2 p-4 h-full justify-center items-center flex-1'>
      <div className='flex flex-col gap-2 items-center'>
        <h1 className='text-2xl font-medium'>No tools found</h1>
        <p className='text-xs text-muted-foreground'>
          Create a tool to get started
        </p>
      </div>
    </div>
  )
}

type ToolsListProps = {
  tools: TAgentTool[]
  className?: string
}

function ToolsList({ tools, className }: ToolsListProps) {
  if (tools.length === 0) {
    return <EmptyToolsList />
  }
  return (
    <div className={cn('flex flex-col gap-2 p-4', className)}>
      {tools.map((tool) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          className='border border-primary/50 rounded-md dark:border-primary/20'
        />
      ))}
    </div>
  )
}

type TToolCardProps = {
  tool: TAgentTool
  className?: string
}
function ToolCard({ tool, className }: TToolCardProps) {
  return (
    <div className={cn('flex flex-col gap-2 p-4', className)}>
      <div className='flex flex-col'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex gap-4 items-center'>
            <h1 className='text-lg font-medium'>{tool.name}</h1>
            <div className='flex gap-2 text-[10px] p-1 px-2 rounded-md bg-muted-foreground/10 text-muted-foreground'>
              <WrenchIcon className='w-4 h-4' />
              <p className=''>{tool.type}</p>
            </div>
          </div>
          <ToolCardActionMenu tool={tool} />
        </div>
        <p className='text-sm text-muted-foreground'>{tool.description}</p>
      </div>
      <Separator className='bg-primary/50 dark:bg-primary/20' />
      {tool.type === 'SEARCH_PDF' && (
        <div className='flex gap-2 items-center'>
          <p className='text-xs text-muted-foreground font-medium'>FILES :</p>
          {tool.searchPDFTool?.files.map((file) => (
            <p
              className='text-xs text-primary-foreground bg-primary px-2 py-1 rounded-md'
              key={file.id}
            >
              {file.filename}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export default page
