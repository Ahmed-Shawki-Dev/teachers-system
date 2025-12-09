'use server'

import { Prisma } from '@/lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const getUnpaidSessions = async (groupId: string) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Unauthorized')

  // هات الجروب
  const group = await Prisma.group.findUnique({
    where: { id: groupId },
    select: { name: true, price: true, teacherId: true },
  })

  if (!group || group.teacherId !== teacher.id) throw new Error('Unauthorized')

  // هات كل الطلاب اللي حضروا (PRESENT) في الجروب ده
  // ومعاهم المدفوعات المرتبطة بالحصة دي
  const students = await Prisma.student.findMany({
    where: { enrollments: { some: { groupId } } },
    select: {
      id: true,
      name: true,
      parentPhone: true,
      attendances: {
        where: {
          session: { groupId }, // حصص الجروب ده
          status: 'PRESENT', // اللي حضرها بس
        },
        include: { session: true },
      },
      payments: {
        where: { groupId, type: 'PER_SESSION' },
      },
    },
  })

  // فلتر الناس اللي عليها فلوس
  const debtList = students
    .map((student) => {
      // الحصص اللي حضرها
      const attendedSessionIds = student.attendances.map((a) => a.session.id)

      // الحصص اللي دفعها
      const paidSessionIds = student.payments
        .filter((p) => p.sessionId && attendedSessionIds.includes(p.sessionId))
        .map((p) => p.sessionId)

      // الحصص اللي عليه (حضر - دفع)
      const unpaidSessions = student.attendances.filter(
        (a) => !paidSessionIds.includes(a.session.id),
      )

      return {
        studentId: student.id,
        name: student.name,
        phone: student.parentPhone,
        unpaidCount: unpaidSessions.length,
        totalDebt: unpaidSessions.length * group.price,
        unpaidDates: unpaidSessions.map((a) => a.session.sessionDate),
      }
    })
    .filter((s) => s.unpaidCount > 0) // رجع بس اللي عليه فلوس

  return { debtList, groupName: group.name, price: group.price }
}
