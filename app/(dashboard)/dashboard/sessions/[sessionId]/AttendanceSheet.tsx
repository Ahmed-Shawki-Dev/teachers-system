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
import { DollarSign, Loader2, MessageSquareWarning, Save, ScanBarcode, Search } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react' // 2. ✅ Hooks ضرورية
import { toast } from 'sonner'
import { upsertAttendanceAction } from '../../../../../actions/Attendance/upsertAttendance'

type StudentRecord = {
  studentId: string
  name: string
  studentCode: string
  parentPhone: string
  status: 'PRESENT' | 'ABSENT' | 'EXCUSED' | null
  note: string
  hasPaid: boolean
}

export default function AttendanceSheet({
  sessionId,
  initialData,
  sessionInfo,
  enableBarcode = false,
}: {
  sessionId: string
  initialData: StudentRecord[]
  sessionInfo: {
    groupName: string
    date: Date
    paymentType: 'PER_SESSION' | 'MONTHLY'
    price: number
  }
  enableBarcode?: boolean // اختياري
}) {
  const [students, setStudents] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  // 4. ✅ State عشان نعلم على الطالب اللي لسه مسحوب
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null)

  // 5. ✅ Refs للتعامل مع الـ Hardware Scanner
  const barcodeBuffer = useRef('')
  const lastKeyTime = useRef(Date.now())

  // --- دوال المعالجة (Logic) ---

  const toggleAttendance = (studentId: string) => {
    if (isSaved) setIsSaved(false)

    setStudents((prev) =>
      prev.map((s) => {
        if (s.studentId === studentId) {
          const newStatus = s.status === 'PRESENT' ? 'ABSENT' : 'PRESENT'
          const shouldPay = sessionInfo.paymentType === 'PER_SESSION'
          // لو حضر وهو بيحاسب بالحصة، نعلم انه دفع، ولو غاب نشيل الدفع
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

  // 6. ✅ دالة التعامل مع المسح الضوئي
  const handleBarcodeScan = useCallback(
    (code: string) => {
      // 1. ندور على الطالب بالكود
      const targetStudent = students.find((s) => s.studentCode === code)

      if (targetStudent) {
        // 2. نحدث حالته
        setStudents((prev) =>
          prev.map((s) => {
            if (s.studentCode === code) {
              // الباركود دايماً بيحضر الطالب (مش toggle)
              const newStatus = 'PRESENT'
              const shouldPay = sessionInfo.paymentType === 'PER_SESSION'
              // لو لسه محضرينه حالاً، نعلم إنه دفع (لو الدفع بالحصة)
              // لو هو دافع أصلاً من الأول، نسيبها زي ما هي
              const newHasPaid = shouldPay ? true : s.hasPaid

              return { ...s, status: newStatus, hasPaid: newHasPaid }
            }
            return s
          }),
        )

        // 3. Feedback للمستخدم
        setLastScannedCode(code)
        toast.success(`تم تسجيل: ${targetStudent.name}`)

        // نشيل العلامة بعد ثانتين
        setTimeout(() => setLastScannedCode(null), 2000)
      } else {
        toast.error(`كود غير موجود: ${code}`)
      }
    },
    [students, sessionInfo.paymentType],
  )

  // 7. ✅ الـ Listener بتاع الكيبورد (Scanner)
  useEffect(() => {
    if (!enableBarcode) return // لو مش مفعلة للمدرس ده، نخرج

    const handleKeyDown = (e: KeyboardEvent) => {
      // لو المؤشر جوه Input Search أو أي Input تاني، منتدخلش
      if (
        (e.target as HTMLElement).tagName === 'INPUT' ||
        (e.target as HTMLElement).tagName === 'TEXTAREA'
      )
        return

      const currentTime = Date.now()

      // لو الفرق بين الضغطات كبير (أكتر من 50ms) يبقى ده بني آدم بيكتب ببطء، بنصفر المخزن
      if (currentTime - lastKeyTime.current > 100) {
        barcodeBuffer.current = ''
      }

      lastKeyTime.current = currentTime

      if (e.key === 'Enter') {
        // السكانر بيبعت Enter في الآخر
        if (barcodeBuffer.current.length > 0) {
          handleBarcodeScan(barcodeBuffer.current)
          barcodeBuffer.current = '' // فضي المخزن
        }
      } else if (e.key.length === 1) {
        // جمع الحروف/الأرقام
        barcodeBuffer.current += e.key
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enableBarcode, handleBarcodeScan])

  // --- باقي الدوال (Save, WhatsApp) ---

  const sendAbsenceMessage = (student: StudentRecord) => {
    if (!student.parentPhone) {
      toast.error('لا يوجد رقم هاتف لولي الأمر')
      return
    }

    let phone = student.parentPhone
    if (phone.startsWith('0')) phone = phone.substring(1)
    const finalPhone = `20${phone}`

    const dateStr = new Date(sessionInfo.date).toLocaleDateString('ar-EG', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })

    const message = `السلام عليكم،
نلفت انتباه سيادتكم بأن الطالب: *${student.name}*
تغيب عن حصة اليوم (${dateStr}).
يرجى المتابعة للأهمية.`

    const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name.includes(searchTerm) ||
      student.parentPhone.includes(searchTerm) ||
      student.studentCode.includes(searchTerm),
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
        setIsSaved(true)
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

          <div className='flex flex-col md:flex-row gap-2 w-full md:w-auto items-center'>
            {/* 8. ✅ مؤشر حالة السكانر */}
            {enableBarcode && (
              <div className='flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-md border border-blue-200 animate-in fade-in zoom-in duration-300'>
                <ScanBarcode size={20} />
                <span className='text-sm font-bold whitespace-nowrap'>الماسح جاهز</span>
              </div>
            )}

            <div className='relative flex-1 md:w-[250px] w-full'>
              <Search className='absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='بحث بالاسم، الكود، أو الهاتف...'
                className='pr-9'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleSave} disabled={loading} className='gap-2 w-full md:w-auto'>
              {loading ? <Loader2 className='animate-spin' /> : <Save size={18} />}
              حفظ وتأكيد
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
                  {isSaved && (
                    <TableHead className='text-center font-bold text-red-600 w-[140px]'>
                      تنبيه الغياب
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const isPresent = student.status === 'PRESENT'
                    // 9. ✅ هل ده الطالب اللي لسه مسحوب؟
                    const isScannedNow = student.studentCode === lastScannedCode

                    return (
                      <TableRow
                        key={student.studentId}
                        className={cn(
                          'cursor-pointer transition-all duration-300', // added duration
                          // Highlighting logic
                          isScannedNow
                            ? 'bg-blue-100 dark:bg-blue-900/40 ring-2 ring-inset ring-blue-500 z-10 scale-[1.01]'
                            : isPresent
                            ? 'bg-green-50/50 hover:bg-green-100/50 dark:bg-green-900/10 dark:hover:bg-green-900/20'
                            : 'hover:bg-muted/50',
                        )}
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest('button')) return
                          // لو بتدوس في أي حتة تانية غير الزراير، بيغير الحضور
                          toggleAttendance(student.studentId)
                        }}
                      >
                        <TableCell className='font-medium py-3'>
                          <div className='text-base'>{student.name}</div>
                          <div className='flex gap-2 text-xs text-muted-foreground'>
                            <span
                              className={cn(
                                'font-mono bg-muted px-1 rounded transition-colors',
                                isScannedNow && 'bg-blue-200 text-blue-800 font-bold',
                              )}
                            >
                              {student.studentCode}
                            </span>
                            <span>{student.parentPhone}</span>
                          </div>
                        </TableCell>

                        <TableCell className='text-center'>
                          <div className='flex items-center justify-center'>
                            <Input
                              type='checkbox'
                              checked={isPresent}
                              onChange={() => {}} // Controlled by Row Click
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

                        {isSaved && (
                          <TableCell className='text-center'>
                            {!isPresent && (
                              <Button
                                size='sm'
                                variant='destructive'
                                className='h-8 gap-1 bg-red-100 text-red-700 hover:bg-red-200 border-red-200'
                                onClick={(e) => {
                                  e.stopPropagation()
                                  sendAbsenceMessage(student)
                                }}
                              >
                                <MessageSquareWarning size={16} />
                                إبلاغ
                              </Button>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={isPerSession ? (isSaved ? 4 : 3) : isSaved ? 3 : 2}
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
