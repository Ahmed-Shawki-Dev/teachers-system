'use server'

import { Prisma } from '@/lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const getMonthlySheet = async (groupId: string, monthKey: string) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Unauthorized')

  // ... (نفس كود التأكد من السنة والجروب زي ما هو) ...
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

  // 👇👇👇 التعديل الخطير هنا 👇👇👇
  // 1. هات قائمة بكل الـ IDs بتوع الطلاب اللي في المجموعة دي
  const studentIds = group.enrollments.map((e) => e.studentId)

  // 2. هات المدفوعات بتاعة الطلاب دول للشهر ده، في "أي مجموعة" تخص المدرس ده
  const payments = await Prisma.payment.findMany({
    where: {
      monthKey,
      studentId: { in: studentIds }, // دور على الطلاب دول بس
      // التريك: دور في أي مجموعة يكون صاحبها هو المدرس ده
      group: {
        teacherId: teacher.id,
      },
    },
  })

  const sheet = group.enrollments.map((e) => {
    // دور لو الطالب ده ليه أي عملية دفع رجعت في الـ Array
    const payment = payments.find((p) => p.studentId === e.studentId)

    return {
      studentId: e.student.id,
      name: e.student.name,
      phone: e.student.parentPhone,
      isPaid: !!payment, // لو لقينا دفع يبقى تمام
      amount: payment ? payment.amount : group.price, // اعرض المبلغ اللي دفعه فعلياً (حتى لو كان سعر الجروب القديم)
    }
  })

  return { sheet, groupName: group.name, price: group.price }
}
