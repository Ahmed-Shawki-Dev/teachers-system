import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function AttendanceSkeleton() {
  return (
    <div className='space-y-6'>
      <Card className='border-t-4 border-t-muted shadow-md'>
        <CardHeader className='flex flex-col md:flex-row gap-4 items-center justify-between'>
          <div className='space-y-2'>
            <Skeleton className='h-8 w-48' /> {/* اسم المجموعة */}
            <Skeleton className='h-4 w-32' /> {/* التاريخ */}
          </div>
          <div className='flex gap-2 w-full md:w-auto'>
            <Skeleton className='h-10 w-full md:w-[250px]' /> {/* البحث */}
            <Skeleton className='h-10 w-20' /> {/* زرار الحفظ */}
          </div>
        </CardHeader>
        <CardContent>
          <div className='rounded-md border p-2 space-y-3'>
            {/* Table Header */}
            <div className='flex justify-between items-center bg-muted/20 p-2 rounded'>
              <Skeleton className='h-6 w-32' />
              <Skeleton className='h-6 w-16' />
              <Skeleton className='h-6 w-16' />
            </div>
            {/* Rows */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className='flex justify-between items-center p-2 border-b last:border-0'>
                <div className='flex flex-col gap-2'>
                  <Skeleton className='h-5 w-40' /> {/* اسم الطالب */}
                  <div className='flex gap-2'>
                    <Skeleton className='h-3 w-12' /> {/* الكود */}
                    <Skeleton className='h-3 w-20' /> {/* الرقم */}
                  </div>
                </div>
                <div className='flex gap-8'>
                  <Skeleton className='h-6 w-6 rounded' /> {/* Checkbox */}
                  <Skeleton className='h-8 w-8 rounded-full' /> {/* Payment */}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
