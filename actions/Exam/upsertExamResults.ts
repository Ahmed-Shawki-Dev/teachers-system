'use server'

import { Prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

type GradeInput = {
  studentId: string
  score: number
}

export const upsertExamResults = async (examId: string, grades: GradeInput[]) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Unauthorized')

  // تأمين: نتأكد إن الامتحان تبع المدرس
  const exam = await Prisma.exam.findUnique({
    where: { id: examId },
    include: { group: true },
  })

  if (!exam || exam.group.teacherId !== teacher.id) {
    throw new Error('غير مصرح لك')
  }

  // الحفظ داخل Transaction للأمان
  await Prisma.$transaction(
    grades.map((grade) =>
      Prisma.examResult.upsert({
        where: {
          examId_studentId: {
            examId: examId,
            studentId: grade.studentId,
          },
        },
        update: { score: grade.score },
        create: {
          examId: examId,
          studentId: grade.studentId,
          score: grade.score,
        },
      }),
    ),
  )

  revalidatePath(`/dashboard/exams/${examId}`)
  return { success: true, message: 'تم رصد الدرجات بنجاح 🎓' }
}
