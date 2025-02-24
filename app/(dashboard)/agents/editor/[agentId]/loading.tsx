import { Loader2Icon } from 'lucide-react'
function loading() {
  return (
    <div className='flex flex-col gap-4 h-screen w-full items-center justify-center'>
      <div className='flex flex-col gap-2 items-center justify-center'>
        <h1 className='text-2xl font-bold'>Agent Editor</h1>
        <Loader2Icon className='w-8 h-8 animate-spin' />
        <p className='text-sm text-muted-foreground'>Loading...</p>
      </div>
    </div>
  )
}

export default loading
