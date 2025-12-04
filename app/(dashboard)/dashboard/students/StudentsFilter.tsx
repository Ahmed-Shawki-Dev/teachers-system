'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { grades } from '@/data/grades'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function StudentsFilter() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleFilter = (grade: string) => {
    const params = new URLSearchParams(searchParams)

    // لو اختار صف معين نحطه في الـ URL
    if (grade && grade !== 'all') {
      params.set('grade', grade)
    } else {
      params.delete('grade')
    }

    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Select onValueChange={handleFilter} defaultValue={searchParams.get('grade') || 'all'}>
      <SelectTrigger className='w-[200px]'>
        <SelectValue placeholder='كل الصفوف الدراسية' />
      </SelectTrigger>

      <SelectContent className='max-h-[300px]'>
        <SelectItem value='all' className='font-bold text-primary'>
          عرض كل الصفوف
        </SelectItem>

        {/* اللوب اللي بيقسم المراحل */}
        {grades.map((group) => (
          <SelectGroup key={group.label}>
            <SelectLabel className='text-muted-foreground bg-muted/50 px-2 py-1'>
              {group.label}
            </SelectLabel>
            {group.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}
