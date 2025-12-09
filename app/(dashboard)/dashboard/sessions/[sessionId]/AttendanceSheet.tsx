'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { DollarSign, Loader2, Save, Search } from 'lucide-react' // ضفنا أيقونة الدولار
import { useState } from 'react'
import { toast } from 'sonner'
import { upsertAttendanceAction } from '../upsertAttendance' // تأكد إن ده اسم الأكشن عندك

type StudentRecord = {
  studentId: string
  name: string
  parentPhone: string
  status: 'PRESENT' | 'ABSENT' | 'EXCUSED' | null
  note: string
  hasPaid: boolean // 👈 ضفنا دي
}

export default function AttendanceSheet({
  sessionId,
  initialData,
  sessionInfo, // 👈 بيانات الجروب (اسم، نوع دفع، سعر)
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

  // 1. دالة تغيير الحضور (الذكية)
  const toggleAttendance = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.studentId === studentId) {
          const newStatus = s.status === 'PRESENT' ? 'ABSENT' : 'PRESENT'

          // اللوجيك الذكي:
          // لو بقى "حاضر" والمجموعة "بالحصة" -> يبقى "دفع" أوتوماتيك
          // لو بقى "غائب" -> يبقى "مدفعش" أكيد
          const shouldPay = sessionInfo.paymentType === 'PER_SESSION'
          const newHasPaid = shouldPay && newStatus === 'PRESENT' ? true : false

          return { ...s, status: newStatus, hasPaid: newHasPaid }
        }
        return s
      }),
    )
  }

  // 2. دالة تغيير الدفع (للحالات الاستثنائية)
  const togglePayment = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, hasPaid: !s.hasPaid } : s)),
    )
  }

  const filteredStudents = students.filter(
    (student) => student.name.includes(searchTerm) || student.parentPhone.includes(searchTerm),
  )

  const handleSave = async () => {
    setLoading(true)
    try {
      const formattedData = students.map((s) => ({
        studentId: s.studentId,
        // 👇 التعديل هنا: بنجبره يقبلها كـ "PRESENT" أو "ABSENT" مش مجرد نص
        status: (s.status === 'PRESENT' ? 'PRESENT' : 'ABSENT') as 'PRESENT' | 'ABSENT',
        note: s.note || '', // عشان ميبقاش undefined
        hasPaid: s.hasPaid,
      }))

      const res = await upsertAttendanceAction(
        sessionId,
        formattedData, // دلوقتي النوع متطابق
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
                placeholder='بحث عن طالب...'
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
          <div className='border rounded-md overflow-hidden'>
            <table className='w-full text-sm text-right'>
              <thead className='bg-muted/50'>
                <tr className='border-b'>
                  <th className='p-4 font-medium'>اسم الطالب</th>
                  <th className='p-4 font-medium text-center w-[120px]'>التحضير</th>

                  {/* عمود الدفع يظهر فقط لو المجموعة بالحصة */}
                  {isPerSession && (
                    <th className='p-4 font-medium text-center w-[120px]'>
                      الدفع{' '}
                      <span className='text-xs text-muted-foreground'>({sessionInfo.price}ج)</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const isPresent = student.status === 'PRESENT'

                    return (
                      <tr
                        key={student.studentId}
                        className={cn(
                          'border-b last:border-0 transition-colors',
                          isPresent ? 'bg-green-50/40' : 'hover:bg-muted/5',
                        )}
                      >
                        {/* اسم الطالب */}
                        <td
                          className='p-4 font-medium cursor-pointer'
                          onClick={() => toggleAttendance(student.studentId)}
                        >
                          <div className='text-base'>{student.name}</div>
                          <div className='text-xs text-muted-foreground md:hidden'>
                            {student.parentPhone}
                          </div>
                        </td>

                        {/* زرار الحضور */}
                        <td className='p-4 text-center'>
                          <div
                            onClick={() => toggleAttendance(student.studentId)}
                            className={cn(
                              'inline-flex cursor-pointer items-center justify-center rounded-full px-3 py-1 text-xs font-bold border select-none transition-all',
                              isPresent
                                ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                                : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200',
                            )}
                          >
                            {isPresent ? 'حاضر' : 'غائب'}
                          </div>
                        </td>

                        {/* زرار الدفع (للحصة فقط) */}
                        {isPerSession && (
                          <td className='p-4 text-center'>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                togglePayment(student.studentId)
                              }}
                              className={cn(
                                'w-9 h-9 rounded-full flex items-center justify-center border transition-all mx-auto',
                                student.hasPaid
                                  ? 'bg-green-600 text-white border-green-600 shadow-sm hover:bg-green-700'
                                  : 'bg-transparent text-muted-foreground border-dashed hover:border-red-400 hover:text-red-500',
                              )}
                              title={student.hasPaid ? 'تم الدفع' : 'لم يدفع'}
                            >
                              <DollarSign className='w-4 h-4' />
                            </button>
                          </td>
                        )}
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={isPerSession ? 3 : 2}
                      className='p-8 text-center text-muted-foreground'
                    >
                      لا يوجد طالب بهذا الاسم
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
