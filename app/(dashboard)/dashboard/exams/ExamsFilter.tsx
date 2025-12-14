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
// 👇 استيراد الدالة
import { getFullGroupName } from '@/utils/groupName'

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
        {groups.map((g) => {
          const {grade,name} = g
return (
  <SelectItem key={g.id} value={g.id}>
    {getFullGroupName({grade,name})}
  </SelectItem>
)
        }
        )}
      </SelectContent>
    </Select>
  )
}
