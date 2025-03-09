'use client'
import { cn } from '@/lib/utils'
import { Message, useChat } from '@ai-sdk/react'
import { Button } from '../ui/button'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type ChatMessageListProps = {
  className?: string
}

export default function ChatMessageList({ className }: ChatMessageListProps) {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <div className='flex flex-col gap-2 flex-1 h-full'>
      <div
        className={cn('flex flex-col gap-2 h-full overflow-y-auto', className)}
      >
        {messages.map((message, index) => (
          <div key={index}>
            {message.role === 'user' ? (
              <UserMessageBubble content={message.content} />
            ) : (
              <AssistantMessageBubble message={message} />
            )}
          </div>
        ))}
      </div>
      <form
        className='flex flex-row items-end gap-2 sticky bottom-0 bg-background pt-2'
        onSubmit={handleSubmit}
      >
        <textarea
          className='w-full resize-none rounded-lg border p-2 min-h-[80px]'
          placeholder='Type your message here...'
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            const isMac = /Mac/.test(navigator.userAgent)
            if (e.key === 'Enter' && (isMac ? e.metaKey : e.ctrlKey)) {
              e.preventDefault()
              handleSubmit(e as any)
            }
          }}
        />
        <Button type='submit'>Send</Button>
      </form>
    </div>
  )
}

type UserMessageBubbleProps = {
  isMyMessage?: boolean
  content: string
}
function UserMessageBubble({ content }: UserMessageBubbleProps) {
  return (
    <div className='flex flex-row justify-end'>
      <div
        className={cn(
          'flex flex-row gap-2 p-2 rounded-lg max-w-[70%] bg-primary text-primary-foreground'
        )}
      >
        <p className='break-words'>{content}</p>
      </div>
    </div>
  )
}

type AssistantMessageBubbleProps = {
  message: Message
}

function AssistantMessageBubble({ message }: AssistantMessageBubbleProps) {
  return (
    <div className={cn('flex flex-col gap-2 p-2 w-full')}>
      <p className='text-sm text-muted-foreground font-bold text-amber-500 dark:text-amber-400'>
        Assistant
      </p>
      <div className='prose dark:prose-invert w-full max-w-none p-2'>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
