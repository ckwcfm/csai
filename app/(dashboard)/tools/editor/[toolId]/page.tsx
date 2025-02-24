import { getAgentToolByIdForUser } from '@/app/actions/agentTools/getAgentToolByIdForUser'
import { TAgentTool } from '@/types/agentTool'
import PDFSidebar from '../../_components/PDFSidebar'
import SearchPDFToolUpdate from '../../_components/SearchPDFToolUpdate'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import BackButton from '@/components/BackButton'
import { WrenchIcon } from 'lucide-react'
type ToolEditorPageProps = {
  params: {
    toolId: string
  }
}

export default async function page({ params }: ToolEditorPageProps) {
  const toolId = Number(params.toolId)
  const tool = await getAgentToolByIdForUser(toolId)
  if (!tool) {
    return <ToolNotFound />
  }
  return (
    <div className='flex flex-col gap-4'>
      {tool.type === 'SEARCH_PDF' && <SearchPDFToolEditor tool={tool} />}
    </div>
  )
}

function ToolNotFound() {
  return (
    <div className='flex flex-col gap-4 items-center justify-center h-full text-center'>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-row gap-2 items-center justify-center'>
          <WrenchIcon size={32} />
          <h1 className='text-2xl font-bold'>Tool not found</h1>
        </div>
        <p className='text-sm text-muted-foreground'>
          The tool you are looking for does not exist.
        </p>
        <div className='flex flex-row gap-2 items-center justify-center'>
          <BackButton href='/tools' />
          <p>Go back to tools</p>
        </div>
      </div>
    </div>
  )
}

function ToolEditorHeader({
  tool,
  className,
}: {
  tool: TAgentTool
  className?: string
}) {
  return (
    <div className={cn('flex gap-4 items-center', className)}>
      <BackButton href='/tools' />
      <h1 className='text-2xl font-bold'>{tool.name}</h1>
      <p className='text-sm text-muted-foreground bg-primary/5 dark:bg-secondary/10 p-2 rounded-md'>
        {tool.type}
      </p>
    </div>
  )
}

async function SearchPDFToolEditor({ tool }: { tool: TAgentTool }) {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex gap-4'>
        <div className='flex flex-col gap-2'>
          <ToolEditorHeader tool={tool} className='p-6' />
          <SearchPDFToolUpdate tool={tool} className='h-full flex-1 p-6' />
        </div>
        <PDFSidebar />
      </div>
    </div>
  )
}
