'use client'

import { TAgentTool } from '@/types/agentTool'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

type TToolCardProps = {
  tool: TAgentTool
  className?: string
}
function ToolCard({ tool, className }: TToolCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(
          'tool',
          JSON.stringify({
            id: Number(tool.id),
            name: tool.name,
            description: tool.description,
            type: tool.type,
          })
        )
      }}
      className={cn('flex flex-col gap-2', className)}
    >
      <div className='flex flex-col gap-2'>
        <div className='flex flex-col gap-1'>
          <div className='flex justify-between items-center'>
            <h3 className='text-sm font-medium'>{tool.name}</h3>
            <p className='text-[10px] text-primary-foreground bg-muted-foreground px-2 py-1 rounded-md'>
              {tool.type}
            </p>
          </div>
          <p className='text-sm text-muted-foreground'>{tool.description}</p>
        </div>
        <Separator orientation='horizontal' className='bg-muted-foreground' />
        <div className='flex flex-col gap-1 text-xs'>
          {tool.type === 'SEARCH_PDF' &&
            tool.searchPDFTool?.files[0]?.filename && (
              <p className=''>{tool.searchPDFTool.files[0].filename}</p>
            )}
        </div>
      </div>
    </div>
  )
}

export default ToolCard
