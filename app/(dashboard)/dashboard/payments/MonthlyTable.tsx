'use client'

import { toggleMonthlyPayment } from '@/actions/Payment/toggleMonthlyPayment'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input' // 1. استيراد الـ Input
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { Loader2, Search } from 'lucide-react' // 2. استيراد أيقونة البحث
import { useState } from 'react'
import { toast } from 'sonner'

type StudentData = {
  studentId: string
  name: string
  studentCode?: string // 👈 3. ضيفنا الكود هنا (تأكد إنه بييجي من السيرفر)
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
  const [query, setQuery] = useState('') // 👈 4. ستيت للبحث

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

  // 👈 5. لوجيك الفلترة المزدوج (بحث + حالة الدفع)
  const filteredData = data.filter((student) => {
    // فلتر الحالة
    const matchesStatus =
      filter === 'ALL' ? true : filter === 'PAID' ? student.isPaid : !student.isPaid

    // فلتر البحث (كود - اسم - موبايل)
    const searchLower = query.toLowerCase()
    const matchesSearch =
      student.name.toLowerCase().includes(searchLower) ||
      (student.studentCode && student.studentCode.toLowerCase().includes(searchLower)) ||
      student.phone.includes(searchLower)

    return matchesStatus && matchesSearch
  })

  const paidCount = data.filter((s) => s.isPaid).length
  const unpaidCount = data.length - paidCount

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row justify-between gap-4'>
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

        {/* 👈 6. حقل البحث */}
        <div className='relative w-full sm:w-64'>
          <Search className='absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='بحث بالكود، الاسم، الهاتف...'
            className='pr-9'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className='border rounded-md overflow-hidden bg-background'>
        <Table className='text-right'>
          <TableHeader>
            <TableRow className='bg-muted/50 hover:bg-muted/50'>
              <TableHead>الطالب</TableHead>
              <TableHead className='text-center'>الحالة</TableHead>
              <TableHead className='text-center'>الإجراء</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((student) => (
              <TableRow
                key={student.studentId}
                className={cn('hover:bg-muted/5 transition-colors', !student.isPaid && '')}
              >
                <TableCell className='font-medium'>
                  <div>{student.name}</div>
                  <div className='flex gap-2 text-xs text-muted-foreground'>
                    {/* عرض الكود لو موجود */}
                    {student.studentCode && (
                      <span className='bg-muted px-1 rounded font-mono'>{student.studentCode}</span>
                    )}
                    <span className='md:hidden'>{student.phone}</span>
                  </div>
                </TableCell>
                <TableCell className='text-center'>
                  {student.isPaid ? (
                    <Badge className='bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 border-green-200 dark:border-green-800 shadow-none'>
                      تم الدفع
                    </Badge>
                  ) : (
                    <Badge variant='outline' className='text-muted-foreground border-dashed'>
                      لم يدفع
                    </Badge>
                  )}
                </TableCell>
                <TableCell className='text-center'>
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
                </TableCell>
              </TableRow>
            ))}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className='p-8 text-center text-muted-foreground'>
                  لا توجد نتائج مطابقة
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
