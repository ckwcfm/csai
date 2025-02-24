import { Skeleton } from '@/components/ui/skeleton'

export default function PDFSidebarSkeleton() {
  return (
    <div className='flex flex-col gap-2 p-2 text-xs overflow-y-auto flex-1 min-w-[280px] h-screen w-full max-w-[280px]'>
      <Skeleton className='h-4 w-full' />
      <Skeleton className='h-4 w-full' />
      <Skeleton className='h-4 w-full' />
      <Skeleton className='h-4 w-full' />
      <Skeleton className='h-4 w-full' />
      <Skeleton className='h-4 w-full' />
    </div>
  )
}
