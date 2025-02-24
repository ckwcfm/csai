import { getFileForUser } from '@/app/actions/files/getFileForUser'
import { PDFSidebarPDFItem } from '@/app/(dashboard)/tools/_components/PDFSidebarPDFItem'
import { Suspense } from 'react'
import PDFSidebarSkeleton from './PDFSidebarSkeleton'
import { File, FileEmbedding } from '@prisma/client'

export default async function PDFSidebar() {
  const files = await getFileForUser()

  return (
    <Suspense fallback={<PDFSidebarSkeleton />}>
      <PDFSidebarList files={files} />
    </Suspense>
  )
}

type PDFSidebarListProps = {
  files: (File & { embeddings: FileEmbedding[] })[]
}

function PDFSidebarList({ files }: PDFSidebarListProps) {
  return (
    <aside className='min-w-[280px] h-screen w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-separator max-w-[280px] flex flex-col'>
      <div className='text-xl font-bold text-foreground p-4 flex-shrink-0'>
        <h1 className='text-xl font-bold text-foreground'>PDF Files</h1>
        <p className='text-sm text-muted-foreground'>{files?.length} files</p>
        <p className='text-sm text-muted-foreground'>
          drag and drop file to assign to the tool
        </p>
      </div>
      <div className='flex flex-col gap-2 p-2 text-xs overflow-y-auto flex-1'>
        {files?.map((file) => (
          <PDFSidebarPDFItem key={file.id} file={file} />
        ))}
      </div>
    </aside>
  )
}
