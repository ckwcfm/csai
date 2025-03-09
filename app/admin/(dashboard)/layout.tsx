async function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-screen'>
      <AdminSidebar />
      <div className='flex flex-col flex-1 min-h-screen '>{children}</div>
    </div>
  )
}

function AdminSidebar() {
  return <div>AdminSidebar</div>
}

export default layout
