import { Separator } from '@/components/ui/separator'
import SearchPDFToolCreate from '../_components/SearchPDFToolCreate'
import PDFSidebar from '../_components/PDFSidebar'
import BackButton from '@/components/BackButton'

async function page() {
  return (
    <div className='flex flex-col min-h-full overflow-hidden'>
      <Header />
      <Separator />
      <div className='flex flex-row flex-1'>
        <Separator orientation='vertical' />
        <SearchPDFToolCreate className='flex flex-col gap-2 p-4 text-xs overflow-y-auto flex-1' />
        <PDFSidebar />
      </div>
    </div>
  )
}

function Header() {
  return (
    <div className='flex items-center gap-2 p-4'>
      <BackButton href='/tools' />
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-bold'>Create PDF Tool</h1>
        <p className='text-sm text-muted-foreground'>
          This tool allows you agent to search with in pdf files that you assign
          to it. The PDF files need to be embedded before you can use it.
        </p>
      </div>
    </div>
  )
}

export default page
