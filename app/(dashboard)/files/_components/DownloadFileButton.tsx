'use client'

import { getS3PresignedUrlForDownload } from '@/app/actions/files/getS3PresignedUrlForDownload'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { Loader2Icon, LinkIcon } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function DownloadFileButton({ fileId }: { fileId: number }) {
  const { refetch, isFetching } = useQuery({
    enabled: false,
    refetchOnWindowFocus: false,
    queryKey: ['download-file', fileId],
    queryFn: async () => {
      const url = await getS3PresignedUrlForDownload(fileId)
      window.open(url, '_blank')
    },
  })

  const onDownload = async () => {
    await refetch()
  }
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            onClick={onDownload}
            disabled={isFetching}
          >
            {isFetching ? (
              <Loader2Icon className='w-4 h-4 animate-spin' />
            ) : (
              <LinkIcon className='w-4 h-4' />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Download</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
