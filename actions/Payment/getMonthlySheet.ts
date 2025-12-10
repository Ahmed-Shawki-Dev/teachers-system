'use server'

import { Prisma } from '@/lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const getMonthlySheet = async (groupId: string, monthKey: string) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Unauthorized')

  // 🛡️ SECURITY CHECK
  // نتأكد إن السنة في الـ monthKey منطقية
  const [_, yearStr] = monthKey.split('-')
  const year = parseInt(yearStr)
  const currentYear = new Date().getFullYear()

  if (isNaN(year) || year > currentYear + 1 || year < currentYear - 1) {
    // نرجع شيت فاضي أو نضرب إيرور، الأفضل هنا نضرب إيرور عشان الـ UI يفهم
    throw new Error('Invalid Date Range')
  }

  const group = await Prisma.group.findUnique({
    where: { id: groupId },
    include: {
      enrollments: {
        include: { student: true },
        orderBy: { student: { name: 'asc' } },
      },
    },
  })

  if (!group || group.teacherId !== teacher.id) throw new Error('غير مصرح')

  const payments = await Prisma.payment.findMany({
    where: {
      groupId,
      monthKey,
    },
  })

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
