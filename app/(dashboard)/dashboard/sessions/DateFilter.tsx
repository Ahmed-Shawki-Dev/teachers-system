'use client'

import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react' // تأكد إنك مستورد useState

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export default function DateFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 1. state عشان نتحكم في فتح وقفل الـ Popover
  const [open, setOpen] = useState(false)

  // بنقرأ التاريخ من الـ URL مباشرة
  const dateParam = searchParams.get('date')
  const date = dateParam ? new Date(dateParam) : new Date()

  const onSelectDate = (newDate: Date | undefined) => {
    // 2. أول حاجة نقفل الـ Popover
    setOpen(false)

    if (newDate) {
      const formattedDate = format(newDate, 'yyyy-MM-dd')
      router.push(`?date=${formattedDate}`, { scroll: false })
    } else {
      router.push('?', { scroll: false })
    }
  }

  return (
    // 3. بنربط الـ state بالـ Popover
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-60 justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? format(date, 'PPP', { locale: ar }) : <span>اختر تاريخاً</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='end'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={onSelectDate}
          initialFocus
          locale={ar}
          dir='rtl'
          className='font-sans'
        />
      </PopoverContent>
    </Popover>
  )
}
