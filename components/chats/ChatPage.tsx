import { cn } from '@/lib/utils'
import ChatMessageList from './ChatMessageList'

type ChatPageProps = {
  className?: string
}

export default function ChatPage({ className }: ChatPageProps) {
  return (
    <div className={cn('flex flex-col h-screen ', className)}>
      <div className='p-4'>
        <h1 className='text-2xl font-bold'>Chat</h1>
      </div>
      <div className='flex-1 overflow-hidden'>
        <ChatMessageList />
      </div>
    </div>
  )
}
