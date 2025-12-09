'use client'

import { settleStudentDebt } from '@/actions/Payment/settleStudentDebt'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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

export default function UnpaidTable({ data, price, groupId }: UnpaidTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleSettle = async (studentId: string) => {
    setLoadingId(studentId)
    try {
      const res = await settleStudentDebt(studentId, groupId)
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
      <table className='w-full text-right'>
        {/* الهيدر: أحمر فاتح في اللايت، وأحمر غامق شفاف في الدارك */}
        <thead className='bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-100 text-sm'>
          <tr>
            <th className='p-4'>الطالب</th>
            <th className='p-4 text-center'>حصص متأخرة</th>
            <th className='p-4 text-center'>المديونية ({price}ج/حصة)</th>
            <th className='p-4'>التواريخ</th>
            <th className='p-4 text-center'>تسوية</th>
          </tr>
        </thead>
        <tbody>
          {data.map((student) => (
            <tr
              key={student.studentId}
              className='border-b last:border-0 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors'
            >
              <td className='p-4 font-bold text-red-700 dark:text-red-400'>{student.name}</td>

              <td className='p-4 text-center'>
                <Badge
                  variant='outline'
                  className='bg-background text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 text-base px-3'
                >
                  {student.unpaidCount}
                </Badge>
              </td>

              <td className='p-4 text-center font-black text-lg text-red-600 dark:text-red-500'>
                {student.totalDebt} ج.م
              </td>

              <td className='p-4 text-xs text-muted-foreground font-mono'>
                {student.unpaidDates
                  .map((d) =>
                    new Date(d).toLocaleDateString('ar-EG', { month: 'numeric', day: 'numeric' }),
                  )
                  .join(' ، ')}
              </td>

              <td className='p-4 text-center'>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className='p-12 text-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20'>
        لا يوجد متأخرات
        </div>
      )}
    </div>
  )
}
