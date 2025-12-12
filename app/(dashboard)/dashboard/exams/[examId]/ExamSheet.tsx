'use client'

import { upsertExamResults } from '@/actions/Exam/upsertExamResults'
import { Badge } from '@/components/ui/badge'
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
import { Loader2, Save, Search } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

// 🛑 1. تحديث النوع
type StudentGrade = {
  studentId: string
  name: string
  studentCode: string // 👈 ضفناها هنا
  parentPhone: string
  score: number | null
}

export default function ExamSheet({
  examId,
  initialData,
  examInfo,
}: {
  examId: string
  initialData: StudentGrade[]
  examInfo: { title: string; maxScore: number; groupName: string; date: Date }
}) {
  const [students, setStudents] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleScoreChange = (studentId: string, value: string) => {
    if (value === '') {
      setStudents((prev) =>
        prev.map((s) => (s.studentId === studentId ? { ...s, score: null } : s)),
      )
      return
    }

    const numValue = parseFloat(value)

    if (numValue > examInfo.maxScore) {
      toast.warning(`الدرجة لا يمكن أن تتعدى ${examInfo.maxScore}`)
      return
    }

    if (numValue < 0) return

    setStudents((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, score: numValue } : s)),
    )
  }

  // 🛑 2. تحديث الفلتر ليشمل الكود
  const filteredStudents = students.filter(
    (s) =>
      s.name.includes(searchTerm) ||
      s.parentPhone.includes(searchTerm) ||
      s.studentCode.includes(searchTerm), // 👈 البحث بالكود
  )

  const handleSave = async () => {
    setLoading(true)
    try {
      const gradesToSave = students
        .filter((s) => s.score !== null)
        .map((s) => ({
          studentId: s.studentId,
          score: s.score as number,
        }))

      if (gradesToSave.length === 0) {
        toast.info('لم يتم رصد أي درجات للحفظ')
        setLoading(false)
        return
      }

      const res = await upsertExamResults(examId, gradesToSave)

      if (res.success) toast.success(res.message)
      else toast.error('حدث خطأ')
    } catch (error) {
      toast.error('فشل الاتصال بالسيرفر')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader className='flex flex-col md:flex-row gap-4 items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              {examInfo.title}
              <Badge variant='outline'>{examInfo.groupName}</Badge>
            </CardTitle>
            <p className='text-muted-foreground text-sm mt-1 flex items-center gap-2'>
              <span>
                الدرجة العظمى: <b className='text-primary'>{examInfo.maxScore}</b>
              </span>
              <span>•</span>
              <span>{new Date(examInfo.date).toLocaleDateString('ar-EG')}</span>
            </p>
          </div>

          <div className='relative w-full md:w-auto'>
            <Search className='absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='بحث بالكود أو الاسم...'
              className='pr-9 w-full md:w-[250px]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button onClick={handleSave} disabled={loading} className='gap-2 w-full md:w-auto'>
            {loading ? <Loader2 className='animate-spin' /> : <Save size={18} />}
            حفظ الدرجات
          </Button>
        </CardHeader>

        <CardContent>
          <div className='border rounded-md overflow-hidden'>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted/50 hover:bg-muted/50'>
                  <TableHead>بيانات الطالب</TableHead>
                  <TableHead className='w-[150px] text-center'>الدرجة</TableHead>
                  <TableHead className='hidden sm:table-cell'>النسبة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const percentage =
                      student.score !== null
                        ? Math.round((student.score / examInfo.maxScore) * 100)
                        : 0

                    const isFail = percentage < 50 && student.score !== null

                    return (
                      <TableRow
                        key={student.studentId}
                        className='hover:bg-muted/5 transition-colors'
                      >
                        <TableCell className='font-medium'>
                          <div>{student.name}</div>
                          {/* 🛑 3. عرض الكود تحت الاسم */}
                          <div className='flex gap-2 text-xs text-muted-foreground'>
                            <span className='bg-muted px-1 rounded font-mono'>
                              {student.studentCode}
                            </span>
                            <span className='md:hidden'>{student.parentPhone}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className='relative flex items-center justify-center'>
                            <Input
                              type='number'
                              className={`text-center font-bold h-10 w-20 ${
                                isFail ? 'text-red-600 border-red-200 bg-red-50' : ''
                              }`}
                              placeholder='-'
                              value={student.score === null ? '' : student.score}
                              onChange={(e) => handleScoreChange(student.studentId, e.target.value)}
                            />
                            <span className='absolute left-[-15px] text-muted-foreground text-xs'>
                              / {examInfo.maxScore}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className='hidden sm:table-cell'>
                          {student.score !== null ? (
                            <Badge
                              variant={isFail ? 'destructive' : 'secondary'}
                              className='w-12 justify-center'
                            >
                              {percentage}%
                            </Badge>
                          ) : (
                            <span className='text-muted-foreground'>-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className='p-8 text-center text-muted-foreground'>
                      لا يوجد طلاب مطابقين للبحث
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
