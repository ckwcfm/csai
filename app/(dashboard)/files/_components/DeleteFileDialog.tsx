'use client'

import { useMutation } from '@tanstack/react-query'
import { deleteFile } from '@/app/actions/files/deleteFile'
import { Button } from '@/components/ui/button'
import { AlertCircleIcon, Loader2Icon, TrashIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'

type DeleteFileDialogProps = {
  fileId: number
  filename: string
}

export function DeleteFileDialog({ fileId, filename }: DeleteFileDialogProps) {
  const [open, setOpen] = useState(false)
  const { mutate, isPending } = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      toast.success('File deleted successfully', { id: 'delete-file' })
      setOpen(false)
    },
    onError: () => {
      toast.error('Failed to delete file', { id: 'delete-file' })
    },
  })
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='hover:bg-destructive hover:text-destructive-foreground border-destructive text-destructive'
        >
          <TrashIcon className='w-4 h-4' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{filename}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription className='flex items-center gap-2 text-destructive font-semibold'>
            <AlertCircleIcon className='w-4 h-4 text-destructive' />
            <span>This action cannot be undone</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toast.loading(`Deleting file ${filename}...`, {
                id: 'delete-file',
              })
              mutate(fileId)
            }}
          >
            {isPending ? (
              <Loader2Icon className='w-4 h-4 animate-spin' />
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
