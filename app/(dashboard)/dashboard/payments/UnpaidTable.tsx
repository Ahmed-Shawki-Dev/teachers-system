'use client'

import { settleStudentDebt } from '@/actions/Payment/settleStudentDebt'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CheckCheck, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type UnpaidStudent = {
  studentId: string
  name: string
  phone: string
  unpaidCount: number
  totalDebt: number
  unpaidDates: Date[]
}

interface UnpaidTableProps {
  data: UnpaidStudent[]
  price: number
  groupId: string
}

export default function UnpaidTable({ data, price }: UnpaidTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleSettle = async (studentId: string) => {
    setLoadingId(studentId)
    try {
      const res = await settleStudentDebt(studentId)
      if (res.success) toast.success(res.message)
      else toast.error(res.message)
    } catch {
      toast.error('حدث خطأ')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className='border rounded-md overflow-hidden'>
      <Table className='text-right'>
        {/* الهيدر: أحمر فاتح في اللايت، وأحمر غامق شفاف في الدارك */}
        <TableHeader>
          <TableRow className='bg-red-50 dark:bg-red-950/40 hover:bg-red-50 dark:hover:bg-red-950/40'>
            <TableHead className='text-red-900 dark:text-red-100'>الطالب</TableHead>
            <TableHead className='text-center text-red-900 dark:text-red-100'>حصص متأخرة</TableHead>
            <TableHead className='text-center text-red-900 dark:text-red-100'>
              المديونية ({price}ج/حصة)
            </TableHead>
            <TableHead className='text-red-900 dark:text-red-100'>التواريخ</TableHead>
            <TableHead className='text-center text-red-900 dark:text-red-100'>تسوية</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((student) => (
            <TableRow
              key={student.studentId}
              className='hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors'
            >
              <TableCell className='font-bold text-red-700 dark:text-red-400'>
                {student.name}
              </TableCell>

              <TableCell className='text-center'>
                <Badge
                  variant='outline'
                  className='bg-background text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 text-base px-3'
                >
                  {student.unpaidCount}
                </Badge>
              </TableCell>

              <TableCell className='text-center font-black text-lg text-red-600 dark:text-red-500'>
                {student.totalDebt} ج.م
              </TableCell>

              <TableCell className='text-xs text-muted-foreground '>
                {student.unpaidDates
                  .map((d) =>
                    new Date(d).toLocaleDateString('ar-EG', { month: 'numeric', day: 'numeric' }),
                  )
                  .join(' ، ')}
              </TableCell>

              <TableCell className='text-center'>
                <Button
                  size='sm'
                  onClick={() => handleSettle(student.studentId)}
                  disabled={loadingId === student.studentId}
                  className='bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800'
                >
                  {loadingId === student.studentId ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    <CheckCheck className='w-4 h-4' />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className='p-12   text-xl text-center  '>
                <span>لا يوجد أي متأخرات</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
