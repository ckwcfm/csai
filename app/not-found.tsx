import React from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center p-4 min-h-screen'>
      <div className='text-center flex flex-col gap-2'>
        <h1 className='text-6xl font-bold text-primary'>404</h1>
        <p className='text-accent-foreground text-2xl font-semibold'>
          Page not found
        </p>
        <p className='text-muted-foreground'>
          The page you're looking for seems to have gone on vacation without
          leaving a forwarding address
        </p>
      </div>
      <div className='mt-4 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md'>
        <ArrowLeftIcon className='w-4 h-4' />
        <Link href='/' className=''>
          Go back Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
