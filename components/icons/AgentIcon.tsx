import { cn } from '@/lib/utils'
import { BotIcon, BotOffIcon } from 'lucide-react'

type AgentIconProps = React.ComponentProps<typeof BotIcon> & {
  disabled?: boolean
}

export function AgentIcon({ disabled, className, ...props }: AgentIconProps) {
  if (disabled) {
    return <BotOffIcon className={cn('w-4 h-4', className)} {...props} />
  }

  return <BotIcon className={cn('w-4 h-4 ', className)} {...props} />
}
