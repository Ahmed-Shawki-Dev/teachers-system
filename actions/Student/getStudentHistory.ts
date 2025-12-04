'use server'
import { Prisma } from '@/lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const getStudentHistory = async (studentId: string) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Unauthorized')

  const student = await Prisma.student.findUnique({
    where: { id: studentId },
    include: {
      // 1. التعديل هنا: بنجيب المجموعة من خلال جدول الاشتراكات
      enrollments: {
        include: {
          group: { select: { name: true, price: true } },
        },
        take: 1, // بنفترض إنه مشترك في مجموعة واحدة حالياً
      },
      // 2. دي هتشتغل لما تعمل npx prisma generate
      attendances: {
        include: {
          session: { select: { sessionDate: true } },
        },
        orderBy: { session: { sessionDate: 'desc' } },
      },
    },
  })

  if (!student || student.teacherId !== teacher.id) {
    throw new Error('الطالب غير موجود')
  }

  // بنطلع بيانات الجروب من أول اشتراك (لو موجود)
  const activeEnrollment = student.enrollments[0]
  const groupInfo = activeEnrollment?.group

  // حساب الإحصائيات
  const total = student.attendances.length
  const present = student.attendances.filter((a) => a.status === 'PRESENT').length
  const absent = student.attendances.filter((a) => a.status === 'ABSENT').length
  const excused = student.attendances.filter((a) => a.status === 'EXCUSED').length

  return {
    info: {
      id: student.id,
      name: student.name,
      phone: student.parentPhone,
      groupName: groupInfo?.name || 'بدون مجموعة',
      price: groupInfo?.price || 0,
    },
    stats: {
      total,
      present,
      absent,
      excused,
      attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0,
    },
    history: student.attendances.map((record) => ({
      id: record.id,
      date: record.session.sessionDate,
      status: record.status,
      note: record.note,
    })),
  }
}
