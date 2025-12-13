// app/(dashboard)/dashboard/page.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { LayoutDashboard } from 'lucide-react'
import { Suspense } from 'react'
import DashboardData from './DashboardData' // 👈 استدعاء المكون البطيء

// 👑 مكون السكيلتون (الـ Fallback اللي هيظهر فوراً)
const DashboardSkeleton = () => (
  // 🛑 يجب أن تعكس بنية الـ Layout الحقيقية
  <div className='flex flex-col gap-6 p-6 container mx-auto'>
    {/* محاكاة الـ Stat Cards */}
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Skeleton className='h-40' />
      <Skeleton className='h-40' />
      <Skeleton className='h-40' />
      <Skeleton className='h-40' /> 
    </div>

    {/* محاكاة الـ Grid الرئيسي */}
    <div className='grid gap-6 grid-cols-1 lg:grid-cols-7 items-start'>
      {/* العمود الجانبي (جدول اليوم + الإجراءات) */}
      <div className='col-span-1 lg:col-span-3 flex flex-col gap-6 h-full'>
        <Skeleton className='h-[350px]' /> {/* جدول اليوم */}
        <Skeleton className='h-[200px]' /> {/* الإجراءات السريعة */}
      </div>
      {/* الرسم البياني */}
      <Skeleton className='col-span-1 lg:col-span-4 h-[500px]' />
    </div>
  </div>
)

export default function DashboardPage() {

  return (
    <div className='flex flex-col gap-6 p-6 container mx-auto'>
      <div className='flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-4 rounded-lg border shadow-sm'>
        <div className='flex items-center gap-2'>
          <div className='bg-primary/10 p-2 rounded-full text-primary'>
            <LayoutDashboard className='w-6 h-6' />
          </div>
          <div>
            <h2 className='text-2xl font-bold tracking-tight text-primary'>لوحة القيادة</h2>
            <p className='text-sm text-muted-foreground'>نظرة عامة على نشاطك وأرقامك الفعلية</p>
          </div>
        </div>
        <div className='text-sm font-medium bg-secondary px-4 py-2 rounded-full border flex items-center gap-2'>
          <span>
            {new Date().toLocaleDateString('ar-EG', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardData />
      </Suspense>
    </div>
  )
}
