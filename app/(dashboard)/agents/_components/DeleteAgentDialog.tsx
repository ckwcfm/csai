import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { deleteAgent } from '@/app/actions/agents/deleteAgent'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { TrashIcon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
type DeleteAgentDialogProps = {
  agentId: number
  agentName: string
  className?: string
}

function DeleteAgentDialog({
  agentId,
  agentName,
  className,
}: DeleteAgentDialogProps) {
  const [open, setOpen] = useState(false)
  const [confirmingText, setConfirmingText] = useState('')
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    mutationFn: deleteAgent,
    onSuccess: () => {
      toast.success(`Agent ${agentName} deleted successfully`, {
        id: `delete-agent-${agentId}`,
      })
      setOpen(false)
      router.replace('/agents')
    },
    onError: (error) => {
      console.log(error)
      toast.error(`Failed to delete agent ${agentName}`, {
        id: `delete-agent-${agentId}`,
      })
    },
  })

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'flex flex-row items-center gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground',
            className
          )}
        >
          <TrashIcon className='w-4 h-4' />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className='flex flex-row items-center gap-2'>
              <TrashIcon />
              Delete Agent?
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will not be able to recover this agent once it is deleted.
          </AlertDialogDescription>
          <div className='text-sm flex flex-col gap-2 py-4 text-primary'>
            <p>
              Enter <span className='font-bold'>{agentName}</span> to confirm:
            </p>
            <Input
              value={confirmingText}
              onChange={(e) => setConfirmingText(e.target.value)}
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setConfirmingText('')
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmingText !== agentName || isPending}
            className='bg-destructive hover:bg-destructive/90 text-destructive-foreground'
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toast.loading(`Deleting agent ${agentName}...`, {
                id: `delete-agent-${agentId}`,
              })
              mutate(agentId)
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteAgentDialog
