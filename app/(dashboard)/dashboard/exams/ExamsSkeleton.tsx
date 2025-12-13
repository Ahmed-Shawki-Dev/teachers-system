import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function ExamsSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <Card key={i} className='h-full'>
          <CardHeader className='flex flex-row items-start justify-between pb-2 pl-10'>
            <div className='space-y-2'>
              <Skeleton className='h-6 w-32' />
              <Skeleton className='h-4 w-20 rounded-full' />
            </div>
            <Skeleton className='h-8 w-8 rounded-lg' />
          </CardHeader>
          <CardContent className='space-y-4 pt-2'>
            <div className='flex items-center justify-between'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-12' />
            </div>
            <div className='pt-2 border-t'>
              <Skeleton className='h-4 w-32' />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
