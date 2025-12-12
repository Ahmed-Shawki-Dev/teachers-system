'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { DollarSign, Loader2, Save, Search } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { upsertAttendanceAction } from '../../../../../actions/Attendance/upsertAttendance'

type StudentRecord = {
  studentId: string
  name: string
  studentCode: string // 1. ✅ زودنا الكود هنا
  parentPhone: string
  status: 'PRESENT' | 'ABSENT' | 'EXCUSED' | null
  note: string
  hasPaid: boolean
}

export default function AttendanceSheet({
  sessionId,
  initialData,
  sessionInfo,
}: {
  sessionId: string
  initialData: StudentRecord[]
  sessionInfo: {
    groupName: string
    date: Date
    paymentType: 'PER_SESSION' | 'MONTHLY'
    price: number
  }
}) {
  const [students, setStudents] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const toggleAttendance = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.studentId === studentId) {
          const newStatus = s.status === 'PRESENT' ? 'ABSENT' : 'PRESENT'
          const shouldPay = sessionInfo.paymentType === 'PER_SESSION'
          const newHasPaid = shouldPay && newStatus === 'PRESENT' ? true : false
          return { ...s, status: newStatus, hasPaid: newHasPaid }
        }
        return s
      }),
    )
  }

  const togglePayment = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, hasPaid: !s.hasPaid } : s)),
    )
  }

  // 2. ✅ تعديل الفلتر عشان يشمل الكود والاسم والرقم
  const filteredStudents = students.filter(
    (student) =>
      student.name.includes(searchTerm) ||
      student.parentPhone.includes(searchTerm) ||
      student.studentCode.includes(searchTerm), // 👈 ضيفنا دي
  )

  const handleSave = async () => {
    setLoading(true)
    try {
      const formattedData = students.map((s) => ({
        studentId: s.studentId,
        status: (s.status === 'PRESENT' ? 'PRESENT' : 'ABSENT') as 'PRESENT' | 'ABSENT',
        note: s.note || '',
        hasPaid: s.hasPaid,
      }))

      const res = await upsertAttendanceAction(
        sessionId,
        formattedData,
        sessionInfo.price,
        sessionInfo.paymentType === 'PER_SESSION',
      )

      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error('حصلت مشكلة')
      }
    } catch (error) {
      toast.error('حصل خطأ أثناء الحفظ')
    } finally {
      setLoading(false)
    }
  }

  const isPerSession = sessionInfo.paymentType === 'PER_SESSION'

  return (
    <div className='space-y-6'>
      <Card className='border-t-4 border-t-primary shadow-md'>
        <CardHeader className='flex flex-col md:flex-row gap-4 items-center justify-between'>
          <div>
            <CardTitle>{sessionInfo.groupName}</CardTitle>
            <p className='text-muted-foreground text-sm mt-1'>
              {new Date(sessionInfo.date).toLocaleDateString('ar-EG', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className='flex gap-2 w-full md:w-auto'>
            <div className='relative flex-1 md:w-[250px]'>
              <Search className='absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='بحث بالاسم، الكود، أو الهاتف...'
                className='pr-9'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleSave} disabled={loading} className='gap-2'>
              {loading ? <Loader2 className='animate-spin' /> : <Save size={18} />}
              حفظ
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className='rounded-md border'>
            <Table>
              <TableHeader className='bg-muted/50 h-14'>
                <TableRow>
                  <TableHead className='text-right font-bold text-primary'>بيانات الطالب</TableHead>
                  <TableHead className='text-center font-bold text-primary w-[100px]'>
                    حضور
                  </TableHead>
                  {isPerSession && (
                    <TableHead className='text-center font-bold text-primary w-[100px]'>
                      دفع ({sessionInfo.price}ج)
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const isPresent = student.status === 'PRESENT'

                    return (
                      <TableRow
                        key={student.studentId}
                        className={cn(
                          'cursor-pointer transition-colors',
                          isPresent
                            ? 'bg-green-50/50 hover:bg-green-100/50 dark:bg-green-900/10 dark:hover:bg-green-900/20'
                            : 'hover:bg-muted/50',
                        )}
                        onClick={() => toggleAttendance(student.studentId)}
                      >
                        {/* 3. ✅ عرضنا الكود تحت الاسم عشان يبقى واضح */}
                        <TableCell className='font-medium py-3'>
                          <div className='text-base'>{student.name}</div>
                          <div className='flex gap-2 text-xs text-muted-foreground'>
                            <span className='font-mono bg-muted px-1 rounded'>
                              {student.studentCode}
                            </span>
                            <span>{student.parentPhone}</span>
                          </div>
                        </TableCell>

                        <TableCell className='text-center'>
                          <div className='flex items-center justify-center'>
                            <input
                              type='checkbox'
                              checked={isPresent}
                              onChange={() => {}}
                              className='w-5 h-5 accent-primary cursor-pointer rounded border-gray-300 focus:ring-primary'
                            />
                          </div>
                        </TableCell>

                        {isPerSession && (
                          <TableCell className='text-center'>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={(e) => {
                                e.stopPropagation()
                                togglePayment(student.studentId)
                              }}
                              className={cn(
                                'rounded-full h-8 w-8 transition-all hover:scale-110',
                                student.hasPaid
                                  ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 hover:text-white'
                                  : 'bg-transparent text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30',
                              )}
                              title={student.hasPaid ? 'تم الدفع' : 'لم يدفع'}
                            >
                              <DollarSign className='w-4 h-4' />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={isPerSession ? 3 : 2}
                      className='h-24 text-center text-muted-foreground'
                    >
                      لا يوجد طالب بهذا البحث
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
