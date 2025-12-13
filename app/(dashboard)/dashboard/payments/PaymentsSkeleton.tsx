import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function PaymentsSkeleton() {
  return (
    <div className='border rounded-md overflow-hidden bg-background'>
      <Table className='text-right'>
        <TableHeader>
          <TableRow className='bg-muted/50'>
            <TableHead>
              <Skeleton className='h-4 w-20' />
            </TableHead>
            <TableHead className='text-center'>
              <Skeleton className='h-4 w-16 mx-auto' />
            </TableHead>
            <TableHead className='text-center'>
              <Skeleton className='h-4 w-16 mx-auto' />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <TableRow key={index}>
              <TableCell>
                <div className='flex flex-col gap-2'>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-3 w-20 md:hidden' />
                </div>
              </TableCell>
              <TableCell className='text-center'>
                <Skeleton className='h-6 w-16 rounded-full mx-auto' />
              </TableCell>
              <TableCell className='text-center'>
                <Skeleton className='h-8 w-20 rounded-md mx-auto' />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
