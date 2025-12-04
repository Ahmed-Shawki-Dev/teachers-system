'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Loader2, Save } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { upsertAttendanceAction } from '../upsertAttendance'
// هنحتاج نستورد الأكشن ده الخطوة الجاية، بس سيبه دلوقتي
// import { upsertAttendanceAction } from '@/actions/Session/upsertAttendance'

type StudentRecord = {
  studentId: string
  name: string
  parentPhone: string
  status: 'PRESENT' | 'ABSENT' | 'EXCUSED' | null
  note: string
}

export default function AttendanceSheet({
  sessionId,
  initialData,
  groupName,
  date,
}: {
  sessionId: string
  initialData: StudentRecord[]
  groupName: string
  date: Date
}) {
  const [students, setStudents] = useState(initialData)
  const [loading, setLoading] = useState(false)

  // دالة لتغيير حالة الطالب لحظياً في الـ UI
  const updateStatus = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'EXCUSED') => {
    setStudents((prev) => prev.map((s) => (s.studentId === studentId ? { ...s, status } : s)))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // 2. تجهيز الداتا: تنضيف وتحويل الـ null
      const formattedData = students.map((s) => ({
        studentId: s.studentId,
        // التريكاية هنا: لو الحالة null (المستر مختارش)، نعتبره "غائب" ديفولت
        // أو ممكن تطلعله تنبيه، بس الأسهل نعتبره غائب
        status: s.status || 'ABSENT',
        note: s.note,
      }))

      // بنبعت الداتا النضيفة للأكشن
      const res = await upsertAttendanceAction(sessionId, formattedData)

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

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle>{groupName}</CardTitle>
            <p className='text-muted-foreground text-sm mt-1'>
              {new Date(date).toLocaleDateString('ar-EG', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <Button onClick={handleSave} disabled={loading} className='gap-2'>
            {loading ? <Loader2 className='animate-spin' /> : <Save size={18} />}
            حفظ الغياب
          </Button>
        </CardHeader>
        <CardContent>
          <div className='border rounded-md'>
            <table className='w-full text-sm text-right'>
              <thead className='bg-muted/50'>
                <tr className='border-b'>
                  <th className='p-4 font-medium'>اسم الطالب</th>
                  <th className='p-4 font-medium'>الحالة</th>
                  <th className='p-4 font-medium hidden sm:table-cell'>ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.studentId} className='border-b last:border-0 hover:bg-muted/10'>
                    <td className='p-4 font-medium'>{student.name}</td>
                    <td className='p-4'>
                      <div className='flex gap-1 bg-muted p-1 rounded-md w-fit'>
                        {/* زرار حاضر */}
                        <button
                          onClick={() => updateStatus(student.studentId, 'PRESENT')}
                          className={cn(
                            'px-3 py-1 rounded text-xs font-bold transition-all',
                            student.status === 'PRESENT'
                              ? 'bg-green-500 text-white shadow-sm'
                              : 'text-muted-foreground hover:bg-background',
                          )}
                        >
                          حاضر
                        </button>
                        {/* زرار إذن */}
                        <button
                          onClick={() => updateStatus(student.studentId, 'EXCUSED')}
                          className={cn(
                            'px-3 py-1 rounded text-xs font-bold transition-all',
                            student.status === 'EXCUSED'
                              ? 'bg-yellow-500 text-white shadow-sm'
                              : 'text-muted-foreground hover:bg-background',
                          )}
                        >
                          إذن
                        </button>
                        {/* زرار غياب */}
                        <button
                          onClick={() => updateStatus(student.studentId, 'ABSENT')}
                          className={cn(
                            'px-3 py-1 rounded text-xs font-bold transition-all',
                            student.status === 'ABSENT' || student.status === null
                              ? 'bg-red-500 text-white shadow-sm'
                              : 'text-muted-foreground hover:bg-background',
                          )}
                        >
                          غائب
                        </button>
                      </div>
                    </td>
                    <td className='p-4 hidden sm:table-cell'>
                      {/* ممكن تضيف Input للملاحظات هنا قدام */}
                      <span className='text-muted-foreground'>--</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
