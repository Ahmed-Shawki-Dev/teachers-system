'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter, useSearchParams } from 'next/navigation'
import { IGroupDB } from '../../../../interfaces/groups'

export default function ExamsFilter({ groups }: { groups: IGroupDB[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentGroup = searchParams.get('groupId') || 'all'

  const handleFilter = (val: string) => {
    const params = new URLSearchParams(searchParams)
    if (val && val !== 'all') params.set('groupId', val)
    else params.delete('groupId')

    router.push(`?${params.toString()}`)
  }

  return (
    <Select value={currentGroup} onValueChange={handleFilter}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='كل المجموعات' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>كل المجموعات</SelectItem>
        {groups.map((g) => (
          <SelectItem key={g.id} value={g.id}>
            {g.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
