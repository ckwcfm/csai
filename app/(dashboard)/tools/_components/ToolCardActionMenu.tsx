'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  MoreHorizontalIcon,
  MoreVerticalIcon,
  TrashIcon,
  WrenchIcon,
  Loader2Icon,
  PencilIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { TAgentTool } from '@/types/agentTool'
import { deleteAgentTool } from '@/app/actions/agentTools/deleteAgentTool'
import { useMutation } from '@tanstack/react-query'

type ToolCardActionMenuProps = {
  tool: TAgentTool
}

function ToolCardActionMenu({ tool }: ToolCardActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='sm' variant='ghost'>
          <MoreVerticalIcon className='w-4 h-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DeleteToolMenuItem tool={tool} />
        <EditToolMenuItem tool={tool} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DeleteToolMenuItem({ tool }: { tool: TAgentTool }) {
  const { mutate, isPending } = useMutation({
    mutationFn: deleteAgentTool,
    onSuccess: () => {
      toast.success('Tool deleted successfully', {
        id: 'delete-tool',
      })
    },
    onError: () => {
      toast.error('Failed to delete tool', {
        id: 'delete-tool',
      })
    },
  })
  const onDelete = () => {
    toast.loading('Deleting tool...', {
      id: 'delete-tool',
    })
    mutate(Number(tool.id))
  }
  return (
    <DropdownMenuItem
      className='text-destructive'
      onClick={onDelete}
      disabled={isPending}
    >
      {isPending && <Loader2Icon className='w-4 h-4 animate-spin' />}
      {!isPending && (
        <>
          <TrashIcon className='w-4 h-4' />
          Delete
        </>
      )}
    </DropdownMenuItem>
  )
}

function EditToolMenuItem({ tool }: { tool: TAgentTool }) {
  return (
    <DropdownMenuItem asChild>
      <Link href={`/tools/editor/${tool.id}`}>
        <PencilIcon className='w-4 h-4' />
        Edit
      </Link>
    </DropdownMenuItem>
  )
}
export default ToolCardActionMenu
