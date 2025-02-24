'use client'

import {
  TAgentTool,
  TSearchPDFToolForm,
  TUpdateAgentPDFTool,
} from '@/types/agentTool'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { updateAgentSearchPDFTool } from '@/app/actions/agentTools/updateAgentTool'
import SearchPDFToolForm from './SearchPDFToolForm'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { SearchPDFToolFormSchema } from '@/schemas/agentTool'
import { cn } from '@/lib/utils'
type UpdateSearchPDFToolProps = {
  tool: TAgentTool
  className?: string
}

export default function SearchPDFToolUpdate({
  tool,
  className,
}: UpdateSearchPDFToolProps) {
  const router = useRouter()

  const form = useForm<TSearchPDFToolForm>({
    resolver: zodResolver(SearchPDFToolFormSchema),
    defaultValues: {
      name: tool.name,
      description: tool.description,
      files: tool.searchPDFTool?.files || [],
      type: 'SEARCH_PDF',
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: updateAgentSearchPDFTool,
    onSuccess: () => {
      toast.success('PDF tool updated successfully', {
        id: 'update-pdf-tool',
      })
      form.reset()
      router.replace('/tools')
    },
    onError: (error) => {
      console.error(error)
      toast.error('Failed to update PDF tool', {
        id: 'update-pdf-tool',
      })
    },
  })

  const onSubmit = (data: TSearchPDFToolForm) => {
    toast.loading('Updating PDF tool...', {
      id: 'update-pdf-tool',
    })
    mutate({
      ...data,
      id: tool.id,
    })
  }

  return (
    <div className={cn(className)}>
      <SearchPDFToolForm
        onSubmit={onSubmit}
        isPending={isPending}
        buttonText='Update'
        form={form}
      />
    </div>
  )
}
