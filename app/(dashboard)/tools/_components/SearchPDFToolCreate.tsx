'use client'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateAgentPDFToolSchema } from '@/schemas/agentTool'
import { TCreateAgentPDFTool } from '@/types/agentTool'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { createAgentSearchPDFTool } from '@/app/actions/agentTools/createAgentTool'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { FileIcon, Loader2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SearchPDFToolForm from './SearchPDFToolForm'

type SearchPDFToolCreateProps = {
  className?: string
}

export default function SearchPDFToolCreate({
  className,
}: SearchPDFToolCreateProps) {
  const router = useRouter()

  const form = useForm<TCreateAgentPDFTool>({
    resolver: zodResolver(CreateAgentPDFToolSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'SEARCH_PDF',
      files: [],
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createAgentSearchPDFTool,
    onSuccess: () => {
      toast.success('PDF tool created successfully', {
        id: 'create-pdf-tool',
      })
      form.reset()
      router.replace('/tools')
    },
    onError: (error) => {
      console.error(error)
      toast.error('Failed to create PDF tool', {
        id: 'create-pdf-tool',
      })
    },
  })

  const onSubmit = (data: TCreateAgentPDFTool) => {
    toast.loading('Creating PDF tool...', {
      id: 'create-pdf-tool',
    })
    mutate(data)
  }

  return (
    <div className={cn(className)}>
      <SearchPDFToolForm
        onSubmit={onSubmit}
        isPending={isPending}
        buttonText='Create'
        form={form}
      />
    </div>
  )
}
