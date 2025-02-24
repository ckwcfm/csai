import Link from 'next/link'
import { ChevronLeftIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function BackButton({
  href,
  className,
}: {
  href: string
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-primary/10 bg-primary/5 dark:bg-secondary/10 p-2 rounded-md',
        className
      )}
    >
      <ChevronLeftIcon />
    </Link>
  )
}
