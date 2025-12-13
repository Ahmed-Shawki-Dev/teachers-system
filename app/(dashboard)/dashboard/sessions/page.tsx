import { Newspaper } from 'lucide-react'
import { Suspense } from 'react'
import DateFilter from './DateFilter'
import SessionsList from './SessionsList'
import SessionsSkeleton from './SessionsSkeleton'
import { format } from 'date-fns'

// تعريف الـ Props لنسخة Next.js 15
type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SessionsPage({ searchParams }: PageProps) {
  // 1. فك الـ Promise بتاع الـ Params
  const params = await searchParams

  // 2. تحديد التاريخ: لو مبعوت ناخده، لو لأ ناخد النهاردة
  const today = format(new Date(), 'yyyy-MM-dd')
  const selectedDate = typeof params.date === 'string' ? params.date : today

  return (
    // نفس حاوية صفحة الامتحانات
    <div className='flex flex-col gap-6 p-4 container mx-auto'>
      {/* الهيدر بستايل الكارت زي ما طلبت */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-lg border shadow-sm'>
        {/* الجزء اليمين: الأيقونة والعنوان */}
        <div className='flex items-center gap-2'>
          <div className='bg-primary/10 p-2 rounded-full text-primary'>
            <Newspaper className='w-6 h-6' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-primary'>الحصص اليومية</h1>
            <p className='text-sm text-muted-foreground'>
              إدارة ومتابعة حصص المجموعات لليوم المحدد.
            </p>
          </div>
        </div>

        {/* الجزء اليسار: الفلتر */}
        <div className='flex gap-2 w-full sm:w-auto'>
          <DateFilter />
        </div>
      </div>

      {/* منطقة عرض الحصص مع الـ Suspense */}
      {/* الـ key مهم عشان لما التاريخ يتغير، يظهر الـ Skeleton تاني */}
      <Suspense key={selectedDate} fallback={<SessionsSkeleton />}>
        <SessionsList date={selectedDate} />
      </Suspense>
    </div>
  )
}
