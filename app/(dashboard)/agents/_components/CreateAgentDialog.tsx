'use client'

import React, { useCallback, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAgentSchema, TCreateAgentSchema } from '@/schemas/agent'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2Icon } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { CreateAgent } from '@/app/actions/agents/createAgent'
import { toast } from 'sonner'
import { Model } from '@prisma/client'
import { AgentModelFormItem } from './AgentModelFormItem'
import { AgentIcon } from '@/components/icons/AgentIcon'

type CreateAgentDialogProps = {
  triggerTitle?: string
  models: Model[]
}

function CreateAgentDialog({ triggerTitle, models }: CreateAgentDialogProps) {
  const [open, setOpen] = useState(false)
  const form = useForm<TCreateAgentSchema>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: CreateAgent,
    onSuccess: () => {
      toast.success('Agent created successfully', { id: 'create-agent' })
    },
    onError: (error) => {
      console.log(error)
      toast.error('Failed to create agent', { id: 'create-agent' })
    },
  })

  const onSubmit = useCallback(
    (values: TCreateAgentSchema) => {
      console.log(values)
      toast.loading('Creating agent...', { id: 'create-agent' })
      mutate(values)
    },
    [mutate]
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset()
        setOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <Button>{triggerTitle ?? 'Create Agent'}</Button>
      </DialogTrigger>
      <DialogContent className='max-w-md px-0'>
        <DialogHeader className='px-4'>
          <DialogTitle className='flex gap-2 items-center text-xl font-bold'>
            <div className='rounded-full bg-primary/10 p-2'>
              <AgentIcon className='w-4 h-4 text-primary' />
            </div>
            <p>Create Agent</p>
          </DialogTitle>
          <DialogDescription>
            Create a new agent to get started
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className='p-6'>
          <Form {...form}>
            <form
              className='flex flex-col gap-8'
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex gap-1 items-center'>
                      <p className='text-sm font-medium'>Name</p>
                      <p className='text-xs text-red-500'>*</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of the agent, agent name must be unique
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex gap-1 items-center'>
                      <p className='text-sm font-medium'>Description</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea className='resize-none' {...field} />
                    </FormControl>
                    <FormDescription>
                      A description of what this agent does, this will be used
                      to help identify the agent
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AgentModelFormItem models={models} />
              <Button type='submit' disabled={isPending}>
                {!isPending && 'Create Agent'}
                {isPending && <Loader2Icon className='w-4 h-4 animate-spin' />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateAgentDialog
