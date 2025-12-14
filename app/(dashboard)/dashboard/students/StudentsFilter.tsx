'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IGroupDB } from '@/interfaces/groups' // 1. استيراد الانترفيس الصح
import { getFullGroupName } from '@/utils/groupName' // 2. استيراد دالة الاسم
import { useRouter, useSearchParams } from 'next/navigation'

// 3. تعديل الـ Props عشان تستقبل IGroupDB[]
export default function StudentsFilter({ groups }: { groups: IGroupDB[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentGroup = searchParams.get('groupId') || 'all'

  const handleFilter = (val: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (val && val !== 'all') params.set('groupId', val)
    else params.delete('groupId')

    // بنرجع للصفحة الأولى مع الفلتر الجديد
    params.set('page', '1')

    router.push(`?${params.toString()}`)
  }

  return (
    <Select value={currentGroup} onValueChange={handleFilter}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='كل المجموعات' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>كل المجموعات</SelectItem>
        {groups.map((group) => (
          <SelectItem key={group.id} value={group.id}>
            {/* 4. استخدام الدالة لعرض الاسم المدمج */}
            {getFullGroupName({ grade: group.grade, name: group.name })}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
