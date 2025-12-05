'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Loader2, Save, Search } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { upsertAttendanceAction } from '../upsertAttendance'

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
  const [searchTerm, setSearchTerm] = useState('')

  // دالة التغيير (Toggle)
  const toggleAttendance = (studentId: string, isChecked: boolean) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === studentId ? { ...s, status: isChecked ? 'PRESENT' : 'ABSENT' } : s,
      ),
    )
  }

  // فلتر البحث
  const filteredStudents = students.filter(
    (student) => student.name.includes(searchTerm) || student.parentPhone.includes(searchTerm),
  )

  const handleSave = async () => {
    setLoading(true)
    try {
      const formattedData = students.map((s) => ({
        studentId: s.studentId,
        status: s.status === 'PRESENT' ? 'PRESENT' : 'ABSENT',
        note: s.note, // بنبعت الملاحظة القديمة زي ما هي (لو موجودة) عشان متمسحش
      }))

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const res = await upsertAttendanceAction(sessionId, formattedData)

      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error('حصلت مشكلة')
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('حصل خطأ أثناء الحفظ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader className='flex flex-col md:flex-row gap-4 items-center justify-between'>
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

          <div className='relative w-full md:w-auto'>
            <Search className='absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='بحث عن طالب...'
              className='pr-9 w-full md:w-[250px]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button onClick={handleSave} disabled={loading} className='gap-2 w-full md:w-auto'>
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
                  <th className='p-4 font-medium text-center w-[150px]'>التحضير</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const isChecked = student.status === 'PRESENT'

                    return (
                      <tr
                        key={student.studentId}
                        className={cn(
                          'border-b last:border-0 transition-colors cursor-pointer',
                          isChecked ? 'bg-green-50/60 hover:bg-green-100/60' : 'hover:bg-muted/10',
                        )}
                        // ميزة إضافية: لو داس على الصف كله يعلم صح
                        onClick={() => toggleAttendance(student.studentId, !isChecked)}
                      >
                        <td className='p-4 font-medium'>
                          <div className='text-base'>{student.name}</div>
                          <div className='text-xs text-muted-foreground md:hidden'>
                            {student.parentPhone}
                          </div>
                        </td>

                        <td className='p-4 text-center'>
                          <label className='flex items-center justify-center p-2 cursor-pointer'>
                            <input
                              type='checkbox'
                              className='w-6 h-6 accent-primary cursor-pointer'
                              checked={isChecked}
                              onChange={(e) =>
                                toggleAttendance(student.studentId, e.target.checked)
                              }
                              // عشان الـ Click بتاع الـ tr ميتعارضش مع الـ checkbox
                              onClick={(e) => e.stopPropagation()}
                            />
                          </label>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={2} className='p-8 text-center text-muted-foreground'>
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
