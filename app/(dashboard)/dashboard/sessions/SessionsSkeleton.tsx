import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function SessionsSkeleton() {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className='overflow-hidden'>
          <CardHeader className='pb-2'>
            <div className='flex justify-between'>
              <Skeleton className='h-5 w-32' />
              <Skeleton className='h-5 w-16' />
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <Skeleton className='h-4 w-full' />
              <div className='flex justify-between pt-2'>
                <Skeleton className='h-8 w-20' />
                <Skeleton className='h-8 w-20' />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
