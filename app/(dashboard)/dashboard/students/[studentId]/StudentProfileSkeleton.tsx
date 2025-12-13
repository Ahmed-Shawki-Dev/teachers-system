import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function StudentProfileSkeleton() {
  return (
    <div className='flex flex-col gap-6 p-4 container mx-auto max-w-5xl'>
      {/* 1. كارت البيانات */}
      <Card className='border-t-4 border-t-muted shadow-md'>
        <CardHeader>
          <div className='flex flex-col sm:flex-row justify-between items-start gap-4'>
            <div className='space-y-2'>
              <Skeleton className='h-8 w-64' /> {/* الاسم */}
              <Skeleton className='h-4 w-32' /> {/* الكود */}
            </div>
            <div className='flex gap-2'>
              <Skeleton className='h-8 w-24 rounded-full' /> {/* بادج المجموعة */}
              <Skeleton className='h-8 w-24 rounded-full' /> {/* بادج الدفع */}
            </div>
          </div>
        </CardHeader>
        <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-4'>
          <Skeleton className='h-16 w-full rounded-lg' />
          <Skeleton className='h-16 w-full rounded-lg' />
        </CardContent>
      </Card>

      {/* 2. الإحصائيات */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        {[1, 2, 3].map((i) => (
          <Card key={i} className='border shadow-sm'>
            <CardContent className='flex flex-col items-center justify-center p-6 gap-2'>
              <Skeleton className='h-12 w-12 rounded-full' />
              <Skeleton className='h-8 w-16' />
              <Skeleton className='h-3 w-20' />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. الجداول */}
      <div className='grid grid-cols-1 gap-8'>
        {[1, 2, 3].map((i) => (
          <Card key={i} className='bg-transparent'>
            <CardHeader>
              <Skeleton className='h-6 w-48' />
            </CardHeader>
            <CardContent>
              <div className='border rounded-lg overflow-hidden space-y-2 p-2'>
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
