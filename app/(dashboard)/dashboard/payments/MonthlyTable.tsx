'use client'

import { toggleMonthlyPayment } from '@/actions/Payment/toggleMonthlyPayment'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type StudentData = {
  studentId: string
  name: string
  phone: string
  isPaid: boolean
  amount: number
}

interface MonthlyTableProps {
  data: StudentData[]
  groupId: string
  monthKey: string
  amount: number
}

export default function MonthlyTable({ data, groupId, monthKey, amount }: MonthlyTableProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'PAID' | 'UNPAID'>('ALL')

  const handleToggle = async (studentId: string) => {
    setLoading(studentId)
    try {
      const res = await toggleMonthlyPayment(studentId, groupId, monthKey, amount)
      if (res.status === 'paid') toast.success(res.message)
      else toast.info(res.message)
    } catch {
      toast.error('حدث خطأ')
    } finally {
      setLoading(null)
    }
  }

  const filteredData = data.filter((student) => {
    if (filter === 'PAID') return student.isPaid
    if (filter === 'UNPAID') return !student.isPaid
    return true
  })

  const paidCount = data.filter((s) => s.isPaid).length
  const unpaidCount = data.length - paidCount

  return (
    <div className='space-y-4'>
      <div className='flex justify-start'>
        <Tabs defaultValue='ALL' onValueChange={(v) => setFilter(v as 'ALL')}>
          <TabsList className='bg-muted'>
            <TabsTrigger value='ALL'>الكل ({data.length})</TabsTrigger>
            <TabsTrigger
              value='PAID'
              className='data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400'
            >
              مدفوع ({paidCount})
            </TabsTrigger>
            <TabsTrigger
              value='UNPAID'
              className='data-[state=active]:text-red-600 dark:data-[state=active]:text-red-400'
            >
              غير مدفوع ({unpaidCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className='border rounded-md overflow-hidden bg-background'>
        <table className='w-full text-right'>
          <thead className='bg-muted/50 text-sm'>
            <tr>
              <th className='p-4'>الطالب</th>
              <th className='p-4 text-center'>الحالة</th>
              <th className='p-4 text-center'>الإجراء</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((student) => (
              <tr
                key={student.studentId}
                className={`border-b last:border-0 hover:bg-muted/5 transition-colors ${
                  !student.isPaid ? 'dark:bg-red-950/10 bg-red-50/30' : ''
                }`}
              >
                <td className='p-4 font-medium'>
                  <div>{student.name}</div>
                  <div className='text-xs text-muted-foreground md:hidden'>{student.phone}</div>
                </td>
                <td className='p-4 text-center'>
                  {student.isPaid ? (
                    <Badge className='bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 border-green-200 dark:border-green-800 shadow-none'>
                      تم الدفع 
                    </Badge>
                  ) : (
                    <Badge variant='outline' className='text-muted-foreground border-dashed'>
                      لم يدفع
                    </Badge>
                  )}
                </td>
                <td className='p-4 text-center'>
                  <Button
                    size='sm'
                    variant={student.isPaid ? 'ghost' : 'default'}
                    onClick={() => handleToggle(student.studentId)}
                    disabled={loading === student.studentId}
                    className={!student.isPaid ? 'bg-primary hover:bg-primary/90' : ''}
                  >
                    {loading === student.studentId ? (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    ) : student.isPaid ? (
                      'إلغاء'
                    ) : (
                      'تحصيل'
                    )}
                  </Button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={3} className='p-8 text-center text-muted-foreground'>
                  لا توجد بيانات
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
