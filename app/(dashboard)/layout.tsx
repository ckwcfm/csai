import DashboardSidebar from '@/components/DashboardSidebar'
import { Separator } from '@/components/ui/separator'
import { ModeToggle } from '@/components/ThemeModeToggle'
import { MobileDashboardSidebar } from '@/components/DashboardSidebar'
import React from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserNavToolbar } from '@/components/UserNavToolbar'

async function layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/sign-in')
  }

  return (
    <div className='flex h-screen'>
      <DashboardSidebar />
      <div className='flex flex-col flex-1 min-h-screen '>
        <header className='flex items-center justify-between px-6 py-4 h-[50px] container'>
          <div className='flex items-center justify-start flex-start '>
            <MobileDashboardSidebar />
            <div>Header</div>
          </div>
          <div className='gap-1 flex items-center'>
            <ModeToggle />
            {session?.user?.email && (
              <UserNavToolbar email={session.user.email} />
            )}
          </div>
        </header>
        <Separator />
        <div className='flex-1 text-accent-foreground h-full overflow-auto'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default layout
