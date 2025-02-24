import { cn } from '@/lib/utils'
import { AgentIcon } from './icons/AgentIcon'
import Link from 'next/link'
import React from 'react'

function Logo({
  fontSize = '2xl',
  iconSize = 20,
}: {
  fontSize?: string
  iconSize?: number
}) {
  return (
    <Link
      href='/'
      className={cn(
        'text-2xl font-extrabold flex items-center gap-2',
        fontSize
      )}
    >
      <div className='rounded-xl bg-gradient-to-r from-zinc-500 to-zinc-600 p-2'>
        <AgentIcon className='stroke-white' size={iconSize} />
      </div>
      <div>
        <span className='bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent'>
          CS
        </span>
        <span className='text-zinc-700 dark:text-zinc-300'>AI</span>
      </div>
    </Link>
  )
}

export default Logo
