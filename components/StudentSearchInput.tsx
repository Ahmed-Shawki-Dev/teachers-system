'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

export default function StudentSearchInput() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)

    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }

    replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <span className='relative'>
      <Input
        placeholder='ابحث باسم الطالب...'
        className='max-w-md w-xs bg-background'
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <span className='absolute left-3 top-2'>
        <Search width={20} height={20} />
      </span>
    </span>
  )
}
