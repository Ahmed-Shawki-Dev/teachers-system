'use client'

import { getDailyClasses, SessionCardData } from '@/actions/Session/getDailyClasses'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import SessionCard from './SessionCard'

export default function SessionsPage() {
  // 1. التاريخ الافتراضي: النهاردة
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState<SessionCardData[]>([])

  // 2. دالة بتجيب الداتا من السيرفر
  const fetchClasses = async (selectedDate: string) => {
    try {
      setLoading(true)
      const data = await getDailyClasses(selectedDate)
      setClasses(data)
      console.log(classes)
    } catch (error) {
      toast.error('حصل مشكلة في تحميل الحصص', error!)
    } finally {
      setLoading(false)
    }
  }

  const dayName = new Date(date).toLocaleDateString('ar-EG', { weekday: 'long' })

  // 3. أول ما التاريخ يتغير، هات الداتا
  useEffect(() => {
    fetchClasses(date)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  return (
    <div className='space-y-6'>
      {/* --- الهيدر والفلتر --- */}
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4 bg-transparent p-4 rounded-lg border'>
        <h1 className='text-2xl font-bold'>جدول الحصص اليومي</h1>
        <h2 className='text-xl font-semibold text-primary'>{dayName}</h2>{' '}
        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground font-medium'>تاريخ العرض:</span>
          <Input
            type='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className='w-fit'
          />
        </div>
      </div>

      {/* --- عرض الكروت --- */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {loading ? (
          <div className='col-span-full flex justify-center py-20'>
            <Loader2 className='animate-spin h-8 w-8 text-primary' />
          </div>
        ) : classes.length > 0 ? (
          classes.map((session, index) => (
            <SessionCard key={index} session={session} currentDate={date} onUpdate={() => fetchClasses(date)} />
          ))
        ) : (
          <div className='col-span-full text-center py-20 text-muted-foreground'>
            مفيش حصص في الجدول لليوم ده 😴
          </div>
        )}
      </div>
    </div>
  )
}
