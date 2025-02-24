import { Skeleton } from '@/components/ui/skeleton'
function loading() {
  return (
    <div className='flex flex-col gap-4 p-4'>
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className='h-24 w-full' />
      ))}
    </div>
  )
}

export default loading
