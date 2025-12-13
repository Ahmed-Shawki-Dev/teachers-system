import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function StudentsSkeleton() {
  return (
    <div className='w-full px-4'>
      <div className='max-w-5xl w-full mx-auto rounded-lg border bg-background overflow-hidden'>
        <Table className='text-right'>
          <TableHeader>
            <TableRow className='bg-muted/50'>
              <TableHead className='w-[100px]'>
                <Skeleton className='h-4 w-12' />
              </TableHead>
              <TableHead>
                <Skeleton className='h-4 w-24' />
              </TableHead>
              <TableHead>
                <Skeleton className='h-4 w-24' />
              </TableHead>
              <TableHead>
                <Skeleton className='h-4 w-16' />
              </TableHead>
              <TableHead className='text-center'>
                <Skeleton className='h-4 w-12 mx-auto' />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className='h-4 w-8' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-32' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-24' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-16' />
                </TableCell>
                <TableCell>
                  <div className='flex gap-2 justify-center'>
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
