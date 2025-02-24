'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCallback, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

export function SearchFileDialog() {
  const [search, setSearch] = useState('')

  const { data: searchResults } = useQuery({
    queryKey: ['search', search],
    queryFn: async () => {
      // TODO: Implement search functionality
      return []
    },
    enabled: search.length > 0,
    staleTime: 1000, // 1 second
    refetchOnWindowFocus: false,
  })

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value)
    },
    []
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Search</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>
            Search for a file by name or content
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-2'>
          <Input
            type='text'
            placeholder='Search'
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
