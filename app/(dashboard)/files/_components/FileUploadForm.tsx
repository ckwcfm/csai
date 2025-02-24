'use client'

import { Button } from '@/components/ui/button'
import { Loader2Icon, PlusIcon } from 'lucide-react'
import { getS3PresignedUrlForUpload } from '@/app/actions/files/getS3PresignedUrlForUpload'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useMutation, useIsMutating } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createFile } from '@/app/actions/files/createFile'
import { TFileContentType } from '@/schemas/file'

function FileUploadForm() {
  const formSchema = z.object({
    file: z.instanceof(File),
  })
  type TFormSchema = z.infer<typeof formSchema>
  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
    },
  })

  const { watch } = form
  const file = watch('file')
  const allowedFileTypes = useMemo(() => ['application/pdf'], [])
  const isMutating = useIsMutating({
    mutationKey: ['uploadFile'],
  })
  const isUploading = useMemo(() => isMutating > 0, [isMutating])

  const { mutate: uploadFile } = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: async (data: TFormSchema) => {
      const { url, key } = await getS3PresignedUrlForUpload(
        data.file.name,
        data.file.type
      )
      await fetch(url, {
        method: 'PUT',
        body: data.file,
        headers: {
          'Content-Type': data.file.type,
        },
      })
      // save file to db
      await createFile({
        key,
        filename: data.file.name,
        contentType: data.file.type as TFileContentType,
      })
      form.reset()
    },
    onSuccess: () => {
      toast.success('File uploaded successfully', { id: 'upload-file' })
    },
    onError: () => {
      toast.error('Failed to upload file', { id: 'upload-file' })
    },
  })

  const onSubmit = useCallback(
    async (data: TFormSchema) => {
      toast.loading('Uploading file...', { id: 'upload-file' })
      uploadFile(data)
    },
    [uploadFile]
  )

  useEffect(() => {
    if (file) {
      onSubmit({ file })
    }
  }, [file])

  const uploadInputRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name='file'
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormControl>
                  <div className='flex gap-2 items-center'>
                    <Button
                      type='button'
                      disabled={isUploading}
                      variant='outline'
                      className='flex gap-2 items-center '
                      onClick={() => {
                        if (uploadInputRef.current) {
                          uploadInputRef.current.click()
                        }
                      }}
                    >
                      <PlusIcon className='w-4 h-4 mr-2' />
                      {isUploading ? (
                        <Loader2Icon className='w-4 h-4 animate-spin' />
                      ) : (
                        <span>Upload File</span>
                      )}
                    </Button>
                    <Input
                      className='hidden'
                      {...rest}
                      type='file'
                      accept={allowedFileTypes.join(',')}
                      ref={uploadInputRef}
                      disabled={isUploading}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          const file = e.target.files[0]
                          form.setValue('file', file)
                        }
                      }}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}

export default FileUploadForm
