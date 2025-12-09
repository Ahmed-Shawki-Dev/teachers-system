'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter, useSearchParams } from 'next/navigation'

// تعريف نوع الجروب
type GroupOption = {
  id: string
  name: string
}

export default function StudentsFilter({ groups }: { groups: GroupOption[] }) {
  const searchParams = useSearchParams()
  const { replace } = useRouter()

  // بنقرا القيمة الحالية من الرابط عشان تفضل مختارة بعد الريفريش
  const currentGroupId = searchParams.get('groupId') || 'all'

  const handleFilter = (groupId: string) => {
    const params = new URLSearchParams(searchParams)

    if (groupId && groupId !== 'all') {
      params.set('groupId', groupId)
    } else {
      params.delete('groupId')
    }

    replace(`?${params.toString()}`)
  }

  return (
    <Select value={currentGroupId} onValueChange={handleFilter}>
      <SelectTrigger className='w-[200px] bg-background'>
        <SelectValue placeholder='كل المجموعات' />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value='all' className='font-bold text-primary'>
          عرض الكل
        </SelectItem>

        {groups.length > 0 ? (
          groups.map((group) => (
            <SelectItem key={group.id} value={group.id}>
              {group.name}
            </SelectItem>
          ))
        ) : (
          <div className='p-2 text-sm text-muted-foreground text-center'>لا توجد مجموعات</div>
        )}
      </SelectContent>
    </Select>
  )
}
