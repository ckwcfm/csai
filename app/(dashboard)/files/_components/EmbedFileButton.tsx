'use client'

import { getS3PresignedUrlForDownload } from '@/app/actions/files/getS3PresignedUrlForDownload'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  generatePDFSummary,
  processPDFDocument,
  searchEmbeddings,
} from '@/lib/file/fileEmbeding'
import { useMutation } from '@tanstack/react-query'
import {
  FileText,
  FolderCode,
  LinkIcon,
  Loader2Icon,
  Search,
} from 'lucide-react'
import { toast } from 'sonner'

export function EmbedFileButton({ fileId }: { fileId: number }) {
  const { mutate: embedFile, isPending } = useMutation({
    mutationFn: async () => {
      const url = await getS3PresignedUrlForDownload(fileId)
      return await processPDFDocument(fileId, url)
    },
    onSuccess: () => {
      toast.success('File embedded successfully')
    },
    onError: () => {
      toast.error('Failed to embed file')
    },
  })

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='outline' size='icon' onClick={() => embedFile()}>
            {isPending ? (
              <Loader2Icon className='w-4 h-4 animate-spin' />
            ) : (
              <FolderCode className='w-4 h-4' />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create Embeddings</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function SummaryButton({ fileId }: { fileId: number }) {
  const { mutate: generateSummary, isPending } = useMutation({
    mutationFn: generatePDFSummary,
    onSuccess: () => {
      toast.success('Summary generated successfully')
    },
    onError: () => {
      toast.error('Failed to generate summary')
    },
  })

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            onClick={() => generateSummary(fileId)}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2Icon className='w-4 h-4 animate-spin' />
            ) : (
              <FileText className='w-4 h-4' />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Generate Summary</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function SearchButton() {
  const onSearch = async () => {
    const results = await searchEmbeddings({
      query: '唯德租約',
    })
    console.log('DEBUG: Search results:', results)
  }
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='outline' size='icon' onClick={onSearch}>
            <Search className='w-4 h-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Search</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
