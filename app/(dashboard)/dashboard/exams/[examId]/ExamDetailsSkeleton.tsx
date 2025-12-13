import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function ExamDetailsSkeleton() {
  return (
    <div className='container mx-auto py-6 max-w-4xl space-y-6'>
      <Card>
        <CardHeader className='flex flex-col md:flex-row gap-4 items-center justify-between'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-8 w-48' /> {/* Title */}
              <Skeleton className='h-6 w-24 rounded-full' /> {/* Group Badge */}
            </div>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-4 w-32' /> {/* Max Score */}
              <Skeleton className='h-4 w-4 rounded-full' />
              <Skeleton className='h-4 w-24' /> {/* Date */}
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-2 w-full md:w-auto items-center'>
            <Skeleton className='h-10 w-full md:w-[250px]' /> {/* Search */}
            <Skeleton className='h-10 w-32' /> {/* Save Button */}
          </div>
        </CardHeader>

        <CardContent>
          <div className='border rounded-md overflow-hidden'>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted/50'>
                  <TableHead>
                    <Skeleton className='h-4 w-32' />
                  </TableHead>
                  <TableHead className='w-[150px] text-center'>
                    <Skeleton className='h-4 w-16 mx-auto' />
                  </TableHead>
                  <TableHead className='hidden sm:table-cell'>
                    <Skeleton className='h-4 w-16' />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className='flex flex-col gap-2'>
                        <Skeleton className='h-5 w-40' /> {/* Name */}
                        <div className='flex gap-2'>
                          <Skeleton className='h-4 w-16' /> {/* Code */}
                          <Skeleton className='h-3 w-20 md:hidden' /> {/* Phone mobile */}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-center'>
                        <Skeleton className='h-10 w-20' /> {/* Score Input */}
                      </div>
                    </TableCell>
                    <TableCell className='hidden sm:table-cell'>
                      <Skeleton className='h-6 w-12 rounded-full' /> {/* Percentage Badge */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
