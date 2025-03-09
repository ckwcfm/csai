'use client'
import { Agent, AgentSearchPDFTool, AgentTool, Model } from '@prisma/client'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { TUpdateAgentSchema } from '@/schemas/agent'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateAgentSchema } from '@/schemas/agent'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { updateAgent } from '@/app/actions/agents/updateAgent'
import { AgentModelFormItem } from './AgentModelFormItem'
import { Loader2Icon, ChevronLeftIcon, TrashIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import DeleteAgentDialog from './DeleteAgentDialog'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { TAgentTool } from '@/types/agentTool'
import { useCallback, useEffect } from 'react'

type AgentEditorProps = {
  agent: Agent & {
    agentsAgentTools: {
      agentTool: AgentTool
    }[]
  }
  models: Model[]
  className?: string
}

function AgentEditor({ agent, models, className }: AgentEditorProps) {
  const router = useRouter()
  const form = useForm<TUpdateAgentSchema>({
    resolver: zodResolver(updateAgentSchema),
    defaultValues: {
      id: agent.id,
      name: agent.name,
      description: agent.description || '',
      prompt: agent.prompt || '',
      model: agent.modelId,
      temperature: agent.temperature || 0,
      maxTokens: agent.maxTokens || 1000,
      enabled: agent.enabled || false,
      tools: agent.agentsAgentTools.map((tool) => ({
        id: Number(tool.agentTool.id),
        name: tool.agentTool.name,
        description: tool.agentTool.description,
        type: tool.agentTool.type,
      })),
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: updateAgent,
    onSuccess: () => {
      toast.success('Agent updated successfully', { id: 'update-agent' })
      router.replace('/agents')
    },
    onError: (error) => {
      console.log(error)
      toast.error('Failed to update agent', { id: 'update-agent' })
    },
  })

  const onSubmit = useCallback(
    (data: TUpdateAgentSchema) => {
      console.log('DEBUG: data', data)
      toast.loading('Updating agent...', { id: 'update-agent' })
      mutate(data)
    },
    [mutate]
  )

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className='flex flex-row justify-between items-center mb-4 border-b pb-4'>
        <div className='flex flex-row items-center gap-2'>
          <Link href='/agents'>
            <ChevronLeftIcon />
          </Link>
          <div className='flex flex-col'>
            <h1 className='text-2xl font-bold'>{agent.name}</h1>
            <p className='text-sm text-muted-foreground'>{agent.description}</p>
          </div>
        </div>
        <DeleteAgentDialog agentId={agent.id} agentName={agent.name} />
      </div>
      <Form {...form}>
        <form
          className='flex flex-col gap-4'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    className='resize-none'
                    {...field}
                    placeholder='Enter a description for the agent'
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <AgentModelFormItem models={models} />
          <FormField
            control={form.control}
            name='prompt'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Textarea className='resize-none' {...field} />
                </FormControl>
                <FormDescription>
                  The prompt to use for the agent. This will be used to generate
                  the agent&apos;s response.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='temperature'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temperature</FormLabel>
                <FormControl>
                  <Input type='number' {...field} />
                </FormControl>
                <FormDescription>
                  The temperature to use for the agent between 0 and 1. 0 is
                  deterministic, 1 is random.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='maxTokens'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Tokens</FormLabel>
                <FormControl>
                  <Input type='number' {...field} />
                </FormControl>
                <FormDescription>
                  The maximum number of tokens to generate.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='enabled'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between'>
                <div>
                  <FormLabel>Enabled</FormLabel>
                  <FormDescription>
                    Whether the agent is enabled or not.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='id'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type='hidden' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <AgentEditorToolsField form={form} />
          <Button type='submit' disabled={isPending}>
            {isPending && <Loader2Icon className='w-4 h-4 mr-2 animate-spin' />}
            {!isPending && 'Save'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

function AgentEditorToolsField({
  form,
}: {
  form: UseFormReturn<TUpdateAgentSchema>
}) {
  // useEffect(() => {
  //   console.log('DEBUG: form.watch("tools")', form.watch('tools'))
  // }, [form.watch('tools')])
  return (
    <FormField
      control={form.control}
      name='tools'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tools</FormLabel>
          <FormControl>
            <div
              onDragOver={(e) => {
                e.preventDefault()
              }}
              onDrop={(e) => {
                e.preventDefault()
                const toolData = e.dataTransfer.getData('tool')
                if (!toolData) {
                  return
                }
                console.log('DEBUG: toolData', toolData)
                const tool = JSON.parse(toolData)
                console.log('DEBUG: tool', tool)
                if (field.value.some((t) => t.id === tool.id)) {
                  return
                }
                console.log('DEBUG: field.value', field.value)
                field.onChange([
                  ...field.value,
                  {
                    id: tool.id,
                    name: tool.name,
                    description: tool.description,
                    type: tool.type,
                  },
                ])
                console.log('DEBUG: field.value', field.value)
              }}
              className='min-h-[100px] border-2 border-dashed rounded-md p-4 flex items-center justify-center text-muted-foreground'
            >
              {field.value.length > 0 ? (
                <div className='flex flex-col gap-4 p-2 w-full'>
                  {field.value.map((tool) => (
                    <div
                      key={tool.id}
                      className='flex flex-col gap-2 bg-muted-foreground/10 p-2 rounded-md'
                    >
                      <div className='flex justify-between items-center'>
                        <div className='flex flex-col gap-2'>
                          <div className='flex gap-2 items-center'>
                            <p className='text-sm font-medium'>{tool.name}</p>
                            <p className='text-[10px] text-primary-foreground bg-muted-foreground px-2 py-1 rounded-md'>
                              {tool.type}
                            </p>
                          </div>
                          <p className='text-sm text-muted-foreground'>
                            {tool.description}
                          </p>
                        </div>
                        <Button
                          variant='destructive'
                          size='icon'
                          onClick={() => {
                            field.onChange(
                              field.value.filter((t) => t.id !== tool.id)
                            )
                          }}
                        >
                          <TrashIcon className='w-4 h-4' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                'Drop tools here'
              )}
            </div>
          </FormControl>
          <FormDescription>The tools to use for the agent.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default AgentEditor
