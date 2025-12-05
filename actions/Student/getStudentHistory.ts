'use server'
import { Prisma } from '@/lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const getStudentHistory = async (studentId: string) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Unauthorized')

  const student = await Prisma.student.findUnique({
    where: { id: studentId },
    include: {
      enrollments: {
        include: {
          group: { select: { name: true, price: true } },
        },
        take: 1,
      },
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

  const activeEnrollment = student.enrollments[0]
  const groupInfo = activeEnrollment?.group

  // حساب الإحصائيات (شيلنا الإذن)
  const total = student.attendances.length
  const present = student.attendances.filter((a) => a.status === 'PRESENT').length
  const absent = student.attendances.filter((a) => a.status === 'ABSENT').length
  // const excused شيلناها خلاص

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
      // شيلنا excused من هنا
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
