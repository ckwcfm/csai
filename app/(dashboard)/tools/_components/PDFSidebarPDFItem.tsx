'use client'

import { FileIcon } from 'lucide-react'
import { File, FileEmbedding } from '@prisma/client'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function PDFSidebarPDFItem({
  file,
}: {
  file: File & { embeddings: FileEmbedding[] }
}) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('fileId', file.id.toString())
        e.dataTransfer.setData('fileName', file.filename)
        e.dataTransfer.effectAllowed = 'move'
      }}
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
      }}
      className={`
        flex flex-row gap-2 rounded-md p-2 justify-start items-center cursor-grab active:cursor-grabbing bg-primary text-primary-foreground hover:bg-primary/80 
      `}
    >
      <FileIcon className='w-4 h-4 flex-shrink-0' />
      <p className='text-sm truncate'>{file.filename}</p>
    </div>
  )
}
