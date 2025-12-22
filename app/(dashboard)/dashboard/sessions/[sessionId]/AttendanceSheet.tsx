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
import {
  Camera,
  CameraOff,
  DollarSign,
  Loader2,
  MessageSquareWarning,
  Save,
  ScanBarcode,
  Search,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { upsertAttendanceAction } from '../../../../../actions/Attendance/upsertAttendance'
// تأكد إن المسار ده صح حسب مكان ملف الـ CameraScanner عندك
import CameraScanner from '../../../../../components/CameraScanner'

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
  enableBarcode?: boolean
}) {
  // 1. تعريف الـ State في الأول
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [students, setStudents] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null)

  const barcodeBuffer = useRef('')
  const lastKeyTime = useRef(Date.now())

  // 2. الدوال (Logic)
  const toggleAttendance = (studentId: string) => {
    if (isSaved) setIsSaved(false)
    setHasUnsavedChanges(true) // ✅ بنعلم إن فيه تغيير
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
    setHasUnsavedChanges(true) // ✅ بنعلم إن فيه تغيير
    setStudents((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, hasPaid: !s.hasPaid } : s)),
    )
  }

  const handleBarcodeScan = useCallback(
    (code: string) => {
      const targetStudent = students.find((s) => s.studentCode === code)

      if (targetStudent) {
        setHasUnsavedChanges(true) // ✅ بنعلم إن فيه تغيير
        setStudents((prev) =>
          prev.map((s) => {
            if (s.studentCode === code) {
              const newStatus = 'PRESENT'
              const shouldPay = sessionInfo.paymentType === 'PER_SESSION'
              const newHasPaid = shouldPay ? true : s.hasPaid
              return { ...s, status: newStatus, hasPaid: newHasPaid }
            }
            return s
          }),
        )

        setLastScannedCode(code)
        toast.success(`تم تسجيل: ${targetStudent.name}`)
        setTimeout(() => setLastScannedCode(null), 2000)
      } else {
        toast.error(`كود غير موجود: ${code}`)
      }
    },
    [students, sessionInfo.paymentType],
  )

  // 3. الـ Effects

  // Effect 1: التعامل مع الكيبورد (Hardware Scanner)
  useEffect(() => {
    if (!enableBarcode) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement).tagName === 'INPUT' ||
        (e.target as HTMLElement).tagName === 'TEXTAREA'
      )
        return

      const currentTime = Date.now()
      if (currentTime - lastKeyTime.current > 100) {
        barcodeBuffer.current = ''
      }
      lastKeyTime.current = currentTime

      if (e.key === 'Enter') {
        if (barcodeBuffer.current.length > 0) {
          handleBarcodeScan(barcodeBuffer.current)
          barcodeBuffer.current = ''
        }
      } else if (e.key.length === 1) {
        barcodeBuffer.current += e.key
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enableBarcode, handleBarcodeScan])

  // Effect 2: حماية الخروج بدون حفظ (Unsaved Changes)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  // 4. باقي الدوال (Save & WhatsApp)
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
    const message = `السلام عليكم،\nنلفت انتباه سيادتكم بأن الطالب: *${student.name}*\nتغيب عن حصة اليوم (${dateStr}).\nيرجى المتابعة للأهمية.`
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
        setHasUnsavedChanges(false) // ✅ بنصفر التغييرات بعد الحفظ
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

  // 5. الـ JSX
  return (
    <div className='space-y-6'>
      <Card className='border-t-4 border-t-primary shadow-md'>
        <CardHeader className='flex flex-col items-center justify-between gap-4 md:flex-row'>
          <div>
            <CardTitle>{sessionInfo.groupName}</CardTitle>
            <p className='mt-1 text-sm text-muted-foreground'>
              {new Date(sessionInfo.date).toLocaleDateString('ar-EG', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className='flex w-full flex-col items-center gap-2 md:w-auto md:flex-row'>
            {enableBarcode && (
              <>
                <Button
                  variant={showCamera ? 'destructive' : 'outline'}
                  onClick={() => setShowCamera(!showCamera)}
                  className='gap-2'
                >
                  {showCamera ? <CameraOff size={18} /> : <Camera size={18} />}
                  {showCamera ? 'إغلاق الكاميرا' : 'سكان بالكاميرا'}
                </Button>

                {!showCamera && (
                  <div className='animate-in fade-in zoom-in duration-300 flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-blue-700'>
                    <ScanBarcode size={20} />
                    <span className='whitespace-nowrap text-sm font-bold'>الماسح جاهز</span>
                  </div>
                )}
              </>
            )}

            <div className='relative w-full flex-1 md:w-[250px]'>
              <Search className='text-muted-foreground absolute top-2.5 right-2.5 h-4 w-4' />
              <Input
                placeholder='بحث بالاسم، الكود، أو الهاتف...'
                className='pr-9'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleSave} disabled={loading} className='w-full gap-2 md:w-auto'>
              {loading ? <Loader2 className='animate-spin' /> : <Save size={18} />}
              حفظ وتأكيد
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {showCamera && (
            <div className='animate-in fade-in zoom-in duration-300 mb-6'>
              <CameraScanner onScan={handleBarcodeScan} />
              <p className='text-muted-foreground mt-2 text-center text-sm'>
                وجه كاميرا الموبايل لكود الطالب ليتم تحضيره تلقائياً
              </p>
            </div>
          )}

          <div className='rounded-md border'>
            <Table>
              <TableHeader className='bg-muted/50 h-14'>
                <TableRow>
                  <TableHead className='text-primary text-right font-bold'>بيانات الطالب</TableHead>
                  <TableHead className='text-primary w-[100px] text-center font-bold'>
                    حضور
                  </TableHead>
                  {isPerSession && (
                    <TableHead className='text-primary w-[100px] text-center font-bold'>
                      دفع ({sessionInfo.price}ج)
                    </TableHead>
                  )}
                  {isSaved && (
                    <TableHead className='text-red-600 w-[140px] text-center font-bold'>
                      تنبيه الغياب
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const isPresent = student.status === 'PRESENT'
                    const isScannedNow = student.studentCode === lastScannedCode

                    return (
                      <TableRow
                        key={student.studentId}
                        className={cn(
                          'cursor-pointer transition-all duration-300',
                          isScannedNow
                            ? 'bg-blue-100 dark:bg-blue-900/40 ring-2 ring-inset ring-blue-500 z-10 scale-[1.01]'
                            : isPresent
                            ? 'bg-green-50/50 hover:bg-green-100/50 dark:bg-green-900/10 dark:hover:bg-green-900/20'
                            : 'hover:bg-muted/50',
                        )}
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest('button')) return
                          toggleAttendance(student.studentId)
                        }}
                      >
                        <TableCell className='py-3 font-medium'>
                          <div className='text-base'>{student.name}</div>
                          <div className='text-muted-foreground flex gap-2 text-xs'>
                            <span
                              className={cn(
                                'bg-muted rounded px-1 font-mono transition-colors',
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
                              onChange={() => {}}
                              className='accent-primary focus:ring-primary h-5 w-5 cursor-pointer rounded border-gray-300'
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
                                'h-8 w-8 rounded-full transition-all hover:scale-110',
                                student.hasPaid
                                  ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 hover:text-white'
                                  : 'text-muted-foreground bg-transparent hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30',
                              )}
                              title={student.hasPaid ? 'تم الدفع' : 'لم يدفع'}
                            >
                              <DollarSign className='h-4 w-4' />
                            </Button>
                          </TableCell>
                        )}

                        {isSaved && (
                          <TableCell className='text-center'>
                            {!isPresent && (
                              <Button
                                size='sm'
                                variant='destructive'
                                className='h-8 gap-1 border-red-200 bg-red-100 text-red-700 hover:bg-red-200'
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
                      className='text-muted-foreground h-24 text-center'
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
