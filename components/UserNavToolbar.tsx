'use client'

import { Button } from '@/components/ui/button'
import { LogOutIcon } from 'lucide-react'
import { signOut } from 'next-auth/react'

export function UserNavToolbar({ email }: { email: string }) {
  return (
    <div className='flex items-center gap-2'>
      <p>{email}</p>
      <Button variant='destructive' size='icon' onClick={() => signOut()}>
        <LogOutIcon />
      </Button>
    </div>
  )
}
