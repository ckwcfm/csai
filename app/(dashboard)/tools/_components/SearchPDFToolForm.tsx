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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FileIcon, Loader2Icon, SparklesIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UseFormReturn } from 'react-hook-form'
import { TSearchPDFToolForm } from '@/types/agentTool'
import { useState } from 'react'
import { generateSearchPDFToolDescription } from '@/app/actions/agentTools/generateAgentToolDescription'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

type SearchPDFToolFormProps = {
  onSubmit: (data: TSearchPDFToolForm) => void
  buttonText?: string
  isPending: boolean
  form: UseFormReturn<TSearchPDFToolForm>
}

export default function SearchPDFToolForm({
  onSubmit,
  isPending,
  buttonText = 'Create',
  form,
}: SearchPDFToolFormProps) {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-4'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name <span className='text-red-500'>*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                This is the name of the tool that will be used to search the PDF
                files. It can only be letters, numbers. no special characters
                and no spaces.
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
              <FormLabel>
                <div className='flex items-center justify-between'>
                  <p>
                    Description <span className='text-red-500'>*</span>
                  </p>
                  <div className='flex items-center gap-2'>
                    <GenerateDescriptionButton form={form} />
                  </div>
                </div>
              </FormLabel>
              <FormControl>
                <Textarea className='resize-none min-h-48' {...field} />
              </FormControl>
              <FormDescription>
                This is the description of the tool. Please describe what the
                tool does and how it will be used. This will be used to help the
                Agent understand the tool and how and when to use it.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='files'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Files <span className='text-red-500'>*</span>
              </FormLabel>
              <FormControl>
                <div
                  className={cn(
                    'border-2 border-dashed rounded-lg p-4 text-center h-48 overflow-y-auto',
                    isDragging && 'bg-primary/10 border-primary'
                  )}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsDragging(false)

                    const fileId = e.dataTransfer.getData('fileId')
                    if (!fileId) return

                    // check if the file is already in the list
                    if (field.value.some((f) => f.id === parseInt(fileId)))
                      return

                    field.onChange([
                      ...field.value,
                      {
                        id: parseInt(fileId),
                        filename: e.dataTransfer.getData('fileName'),
                      },
                    ])
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault()
                    setIsDragging(false)
                  }}
                >
                  {field.value?.length > 0 ? (
                    <div className='flex flex-col gap-2'>
                      {field.value.map((file) => (
                        <div
                          key={file.id}
                          className='flex items-center justify-between bg-secondary p-2 rounded'
                        >
                          <div className='flex items-center gap-2'>
                            <FileIcon className='w-4 h-4' />
                            <span>{file.filename}</span>
                          </div>
                          <Button
                            variant='destructive'
                            size='sm'
                            onClick={() => {
                              field.onChange(
                                field.value.filter((f) => f.id !== file.id)
                              )
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='text-muted-foreground h-full text-sm flex items-center justify-center flex-col gap-2'>
                      <FileIcon className='w-4 h-4' />
                      Drag and drop PDF files here
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                This is the list of PDF files that will be used to search the
                tool. You can add multiple files to the tool.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isPending}>
          {isPending ? (
            <Loader2Icon className='w-4 h-4 animate-spin' />
          ) : (
            buttonText
          )}
        </Button>
      </form>
    </Form>
  )
}

function GenerateDescriptionButton({
  form,
}: {
  form: UseFormReturn<TSearchPDFToolForm>
}) {
  const fileIds = form.getValues('files').map((f) => f.id)
  const { mutate: generateDescription, isPending } = useMutation({
    mutationFn: generateSearchPDFToolDescription,
    onSuccess: (data) => {
      toast.success('Description generated successfully')
      form.setValue('description', data)
    },
    onError: () => {
      toast.error('Failed to generate description')
    },
  })
  return (
    <Button
      type='button'
      size='icon'
      onClick={() => generateDescription({ fileIds })}
    >
      {isPending ? (
        <Loader2Icon className='w-4 h-4 animate-spin' />
      ) : (
        <SparklesIcon className='w-4 h-4' />
      )}
    </Button>
  )
}
