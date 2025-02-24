import { Separator } from '@/components/ui/separator'
import FileUploadForm from './_components/FileUploadForm'
import { Suspense } from 'react'
import Loading from './loading'
import { getFileForUser } from '@/app/actions/files/getFileForUser'
import { FileIcon, LinkIcon, DownloadIcon } from 'lucide-react'
import { File, FileEmbedding } from '@prisma/client'
import { getFileContentTypeLabel } from '@/lib/file/fileContentType'
import { TFileContentType } from '@/schemas/file'
import { DeleteFileDialog } from './_components/DeleteFileDialog'
import { DownloadFileButton } from './_components/DownloadFileButton'
import {
  EmbedFileButton,
  SummaryButton,
  SearchButton,
} from './_components/EmbedFileButton'
import { SearchFileDialog } from './_components/SearchFileDialog'

async function Page() {
  return (
    <div className='flex flex-col gap-2 '>
      <div className='flex flex-col gap-2 container'>
        <FileToolBar />
      </div>
      <Separator />
      <div className='flex flex-col gap-2 container'>
        <Suspense fallback={<Loading />}>
          <FileList />
        </Suspense>
      </div>
    </div>
  )
}

async function FileList() {
  const files = await getFileForUser()
  if (files.length === 0) {
    return <EmptyFileList />
  }
  return (
    <div className='flex flex-col gap-2'>
      {files.map((file) => (
        <FileListItem key={file.id} file={file} />
      ))}
    </div>
  )
}

async function FileListItem({
  file,
}: {
  file: File & { embeddings: FileEmbedding[] }
}) {
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col gap-2 items-start justify-between'>
        <div className='flex items-center justify-start gap-8'>
          <h1 className='text-2xl font-bold'>{file.filename}</h1>
          <div className='flex gap-2 items-center text-xs font-semibold'>
            <p className=' text-muted-foreground bg-muted-foreground/10 p-2 py-1 rounded-md'>
              {getFileContentTypeLabel(file.contentType as TFileContentType)}
            </p>
            {file.embeddings.length > 0 && (
              <p className='text-green-500 bg-green-500/10 p-2 py-1 rounded-md'>
                EMBEDDED
              </p>
            )}
          </div>
        </div>
        {file.summary && (
          <p className='text-sm text-muted-foreground'>
            <span className='font-bold'>Summary:</span> {file.summary}
          </p>
        )}
      </div>
      <div className='flex gap-2 items-center'>
        <EmbedFileButton fileId={file.id} />
        <SummaryButton fileId={file.id} />
        <DownloadFileButton fileId={file.id} />
        <DeleteFileDialog fileId={file.id} filename={file.filename} />
      </div>
    </div>
  )
}

function EmptyFileList() {
  return (
    <div className='flex flex-col gap-2 items-center justify-center mt-8'>
      <div className='flex flex-col gap-2 items-center justify-center'>
        <div className='bg-muted-foreground/10 p-4 rounded-full'>
          <FileIcon className='w-10 h-10 text-muted-foreground' />
        </div>
        <h1 className='text-2xl font-bold'>No files uploaded yet</h1>
        <p className='text-sm text-muted-foreground'>
          You can upload files to your account to use them in your agents.
        </p>
      </div>
      <FileUploadForm />
    </div>
  )
}

function FileToolBar() {
  return (
    <div className='flex gap-2 items-center justify-between'>
      <div className='flex flex-col'>
        <h1 className='text-2xl font-bold'>Files</h1>
        <p className='text-sm text-muted-foreground'>Manage your files here</p>
      </div>
      <div className='flex gap-2 items-center'>
        <FileUploadForm />
        <SearchFileDialog />
        <SearchButton />
      </div>
    </div>
  )
}

export default Page
