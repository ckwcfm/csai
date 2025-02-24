'use client'

import { Button } from '@/components/ui/button'
import { FileIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function CreatePDFToolCard() {
  const router = useRouter()
  return (
    <div className='flex flex-col gap-2'>
      <Button
        className='flex items-center gap-2'
        onClick={() => router.push('/tools/create-pdf')}
      >
        <FileIcon className='w-4 h-4' />
        <p>Create Search PDF Tool</p>
      </Button>
    </div>
  )
}
