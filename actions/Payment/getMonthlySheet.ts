'use server'

import { Prisma } from '@/lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const getMonthlySheet = async (groupId: string, monthKey: string) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Unauthorized')

  const group = await Prisma.group.findUnique({
    where: { id: groupId },
    include: {
      // بنجيب الطلاب بتوع الجروب
      enrollments: {
        include: { student: true },
        orderBy: { student: { name: 'asc' } },
      },
    },
  })

  if (!group || group.teacherId !== teacher.id) throw new Error('غير مصرح')

  // بنجيب اللي دفعوا الشهر ده
  const payments = await Prisma.payment.findMany({
    where: {
      groupId,
      monthKey, // "10-2023"
    },
  })

  // بنركب الداتا على بعض
  const sheet = group.enrollments.map((e) => {
    const isPaid = payments.some((p) => p.studentId === e.studentId)
    return {
      studentId: e.student.id,
      name: e.student.name,
      phone: e.student.parentPhone,
      isPaid,
      amount: group.price,
    }
  })

  return { sheet, groupName: group.name, price: group.price }
}
