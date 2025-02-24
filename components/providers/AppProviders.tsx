'use client'

import { ThemeProvider } from 'next-themes'
import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default function AppProviders({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [queryClient] = useState(() => new QueryClient())

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent flash of unstyled content
  if (!mounted) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        {children}
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
