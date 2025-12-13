import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function GroupsSkeleton() {
  return (
    <div className='w-full px-4'>
      <div className='max-w-6xl w-full mx-auto rounded-lg border shadow-sm overflow-hidden'>
        <Table className='text-right'>
          <TableHeader>
            <TableRow className='bg-muted/50'>
              <TableHead className='w-[200px]'>
                <Skeleton className='h-4 w-20' />
              </TableHead>
              <TableHead>
                <Skeleton className='h-4 w-24' />
              </TableHead>
              <TableHead>
                <Skeleton className='h-4 w-16' />
              </TableHead>
              <TableHead className='text-center w-[150px]'>
                <Skeleton className='h-4 w-12 mx-auto' />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((index) => (
              <TableRow key={index} className='hover:bg-muted/5'>
                <TableCell>
                  <Skeleton className='h-6 w-32 mb-2' />
                </TableCell>
                <TableCell>
                  <div className='flex flex-col gap-2'>
                    <Skeleton className='h-4 w-16' />
                    <Skeleton className='h-3 w-24' />
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex flex-wrap gap-2'>
                    <Skeleton className='h-6 w-24 rounded-full' />
                    <Skeleton className='h-6 w-24 rounded-full' />
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center justify-center gap-2'>
                    <Skeleton className='h-8 w-8 rounded-md' />
                    <Skeleton className='h-8 w-8 rounded-md' />
                    <Skeleton className='h-8 w-8 rounded-md' />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
