'use client'

import { settleStudentDebt } from '@/actions/Payment/settleStudentDebt'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input' // استيراد
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CheckCheck, Loader2, Search } from 'lucide-react' // استيراد
import { useState } from 'react'
import { toast } from 'sonner'

type UnpaidStudent = {
  studentId: string
  name: string
  studentCode?: string // 👈 ضفنا الكود
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
  const [query, setQuery] = useState('') // 👈 ستيت البحث

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

  // 👈 لوجيك البحث
  const filteredData = data.filter((student) => {
    const searchLower = query.toLowerCase()
    return (
      student.name.toLowerCase().includes(searchLower) ||
      (student.studentCode && student.studentCode.toLowerCase().includes(searchLower)) ||
      student.phone.includes(searchLower)
    )
  })

  return (
    <div className='space-y-4'>
      {/* 👈 حقل البحث */}
      <div className='flex justify-end'>
        <div className='relative w-full sm:w-64'>
          <Search className='absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='بحث في المديونيات...'
            className='pr-9'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className='border rounded-md overflow-hidden'>
        <Table className='text-right'>
          <TableHeader>
            <TableRow className='bg-red-50 dark:bg-red-950/40 hover:bg-red-50 dark:hover:bg-red-950/40'>
              <TableHead className='text-red-900 dark:text-red-100'>الطالب</TableHead>
              <TableHead className='text-center text-red-900 dark:text-red-100'>
                حصص متأخرة
              </TableHead>
              <TableHead className='text-center text-red-900 dark:text-red-100'>
                المديونية ({price}ج/حصة)
              </TableHead>
              <TableHead className='text-red-900 dark:text-red-100'>التواريخ</TableHead>
              <TableHead className='text-center text-red-900 dark:text-red-100'>تسوية</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((student) => (
              <TableRow
                key={student.studentId}
                className='hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors'
              >
                <TableCell className='font-bold text-red-700 dark:text-red-400'>
                  <div>{student.name}</div>
                  <div className='flex gap-2 text-xs font-normal opacity-80 mt-1'>
                    {student.studentCode && (
                      <span className='bg-red-100/50 px-1 rounded font-mono'>
                        {student.studentCode}
                      </span>
                    )}
                  </div>
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
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className='p-12 text-xl text-center'>
                  <span>لا توجد نتائج</span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
