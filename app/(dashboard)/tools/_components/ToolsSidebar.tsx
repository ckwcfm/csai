import { CreatePDFToolCard } from './CreateToolCards'
export default function ToolsSidebar() {
  return (
    <div className='flex flex-col gap-2 bg-accent h-full max-w-[280px] w-full shrink-0 p-4'>
      <div className='flex flex-col'>
        <h1 className='text-2xl font-medium'>Tools Templates</h1>
        <p className='text-sm text-muted-foreground'>
          Create a tool to get started
        </p>
      </div>
      <CreatePDFToolCard />
    </div>
  )
}
