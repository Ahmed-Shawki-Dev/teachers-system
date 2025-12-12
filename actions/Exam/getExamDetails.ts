'use server'
import { Prisma } from '@/lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const getExamDetails = async (examId: string) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Unauthorized')

  // 1. هات بيانات الامتحان
  const exam = await Prisma.exam.findUnique({
    where: { id: examId },
    include: {
      group: { select: { id: true, name: true, teacherId: true } },
    },
  })

  if (!exam) throw new Error('الامتحان غير موجود')
  if (exam.group.teacherId !== teacher.id) throw new Error('غير مصرح لك')

  // 2. هات طلاب المجموعة + نتايجهم
  const enrollments = await Prisma.enrollment.findMany({
    where: { groupId: exam.groupId },
    include: {
      student: {
        include: {
          examResults: {
            where: { examId: examId },
          },
        },
      },
    },
    orderBy: { student: { name: 'asc' } },
  })

  // 3. نضف الداتا للعرض
  const students = enrollments.map((enrollment) => {
    const student = enrollment.student
    const result = student.examResults[0]

    return {
      studentId: student.id,
      name: student.name,
      parentPhone: student.parentPhone,
      score: result ? result.score : null,

      // 🛑 التعديل الأول: هات القيمة الحقيقية مش true
      studentCode: student.studentCode,
    }
  })

  return {
    examTitle: exam.title,
    maxScore: exam.maxScore,
    date: exam.date,
    groupName: exam.group.name,
    students,
  }
}
