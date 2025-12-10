'use client'
import { getDailyClasses, SessionCardData } from '@/actions/Session/getDailyClasses'
import { Input } from '@/components/ui/input'
import { Calendar, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import SessionCard from './SessionCard'

export default function SessionsPage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState<SessionCardData[]>([])

  const fetchClasses = async (selectedDate: string) => {
    try {
      setLoading(true)
      const data = await getDailyClasses(selectedDate)
      setClasses(data)
    } catch (error) {
      toast.error('حدث خطأ أثناء تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }

  const dayName = new Date(date).toLocaleDateString('ar-EG', { weekday: 'long' })

  useEffect(() => {
    fetchClasses(date)
  }, [date])

  return (
    <div className='flex flex-col gap-6 p-4 container mx-auto'>
      <div className='flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-4 rounded-lg border shadow-sm'>
        <div className='flex items-center gap-2'>
          <div className='bg-primary/10 p-2 rounded-full text-primary'>
            <Calendar className='w-6 h-6' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-primary'>جدول الحصص</h1>
            <p className='text-sm text-muted-foreground'>متابعة الحصص اليومية وتسجيل الحضور</p>
          </div>
        </div>

        <div className='flex items-center gap-3 w-full sm:w-auto'>
          <span className='text-sm font-medium text-primary'>{dayName}</span>
          <Input
            type='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className='w-fit bg-background'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {loading ? (
          <div className='col-span-full flex justify-center py-20'>
            <Loader2 className='animate-spin h-8 w-8 text-primary' />
          </div>
        ) : classes.length > 0 ? (
          classes.map((session, index) => (
            <SessionCard
              key={index}
              session={session}
              currentDate={date}
              onUpdate={() => fetchClasses(date)}
            />
          ))
        ) : (
          <div className='col-span-full py-12 text-center bg-muted/20 rounded-lg border border-dashed text-muted-foreground'>
            لا توجد حصص مجدولة لهذا اليوم
          </div>
        )}
      </div>
    </div>
  )
}
