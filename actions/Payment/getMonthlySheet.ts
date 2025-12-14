'use server'

import { Prisma } from '@/lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'
import { getFullGroupName } from '@/utils/groupName'

export const getMonthlySheet = async (groupId: string, monthKey: string) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Unauthorized')

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, yearStr] = monthKey.split('-')
  const year = parseInt(yearStr)
  const currentYear = new Date().getFullYear()

  if (isNaN(year) || year > currentYear + 1 || year < currentYear - 1) {
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

  const studentIds = group.enrollments.map((e) => e.studentId)

  const payments = await Prisma.payment.findMany({
    where: {
      monthKey,
      studentId: { in: studentIds },
      group: {
        teacherId: teacher.id,
      },
    },
  })

  const sheet = group.enrollments.map((e) => {
    const payment = payments.find((p) => p.studentId === e.studentId)

    return {
      studentId: e.student.id,
      name: e.student.name,
      studentCode: e.student.studentCode, // 👈👈👈 ضيف ده ضروري
      phone: e.student.parentPhone,
      isPaid: !!payment,
      amount: payment ? payment.amount : group.price,
    }
  })

  return { sheet, groupName: getFullGroupName(group), price: group.price }
}
