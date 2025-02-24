'use client'

import { FileIcon, HomeIcon, MenuIcon, WrenchIcon } from 'lucide-react'
import Link from 'next/link'
import Logo from './Logo'
import { buttonVariants } from './ui/button'
import { usePathname } from 'next/navigation'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'
import { useState } from 'react'
import { AgentIcon } from './icons/AgentIcon'
const routes = [
  {
    label: 'Home',
    href: '/',
    icon: HomeIcon,
  },
  {
    label: 'Agents',
    href: '/agents',
    icon: AgentIcon,
  },
  {
    label: 'Tools',
    href: '/tools',
    icon: WrenchIcon,
  },
  {
    label: 'Files',
    href: '/files',
    icon: FileIcon,
  },
  // {
  //   label: 'Settings',
  //   href: '/settings',
  //   icon: SettingsIcon,
  // },
]

function DashboardSidebar() {
  const pathname = usePathname()
  const activeRoute =
    routes.find((route) =>
      route.href === '/' ? pathname === '/' : pathname.startsWith(route.href)
    ) || routes[0]

  return (
    <div className='hidden relative md:block min-w-[280px] h-screen overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separator max-w-[280px]'>
      <div className='flex items-center justify-center, gap-2 border-b-[1px] border-separate p-4'>
        <Logo />
      </div>
      <div className='flex flex-col p-2 gap-2'>
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={buttonVariants({
              variant:
                activeRoute.href === route.href
                  ? 'sidebarActiveItem'
                  : 'sidebarItem',
            })}
          >
            <route.icon size={20} />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export function MobileDashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const activeRoute =
    routes.find((route) =>
      route.href === '/' ? pathname === '/' : pathname.startsWith(route.href)
    ) || routes[0]

  return (
    <div className='block md:hidden border-separator bg-background'>
      <nav className='container flex items-center justify-between'>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant='ghost' size={'icon'}>
              <MenuIcon />
            </Button>
          </SheetTrigger>

          <SheetTitle className='hidden'>Menu</SheetTitle>
          <SheetContent
            className='w-[280px] sm:w-[320px] space-y-4'
            side={'left'}
          >
            <Logo />
            <div className='flex flex-col gap-6'>
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={buttonVariants({
                    variant:
                      activeRoute.href === route.href
                        ? 'sidebarActiveItem'
                        : 'sidebarItem',
                  })}
                >
                  <route.icon size={20} />
                  {route.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export default DashboardSidebar
