'use server'

import { Prisma } from '@/lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'
import { getFullGroupName } from '@/utils/groupName'

// 👇 1. ضفنا باراميتر جديد (includeArchived) وقيمته الافتراضية false
export const getMonthlySheet = async (
  groupId: string,
  monthKey: string,
  includeArchived: boolean = false,
) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Unauthorized')

  // ... (نفس كود التحقق من السنة) ...
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, yearStr] = monthKey.split('-')
  const year = parseInt(yearStr)
  const currentYear = new Date().getFullYear()

  if (isNaN(year) || year > currentYear + 1 || year < currentYear - 1) {
    throw new Error('Invalid Date Range')
  }

  // 👇 2. جهزنا الشرط بناءً على الفلاج
  const enrollmentFilter = includeArchived
    ? {} // لو عايز الأرشيف، هات كله
    : { student: { isArchived: false } } // لو مش عايز، هات النشط بس

  const group = await Prisma.group.findUnique({
    where: { id: groupId },
    include: {
      enrollments: {
        where: enrollmentFilter, // 👈 طبقنا الشرط هنا
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
      studentCode: e.student.studentCode,
      phone: e.student.parentPhone,
      isPaid: !!payment,
      amount: payment ? payment.amount : group.price,
      isArchived: e.student.isArchived, // 👈 معلومة إضافية لو حبيت تميزهم بلون مختلف
    }
  })

  return { sheet, groupName: getFullGroupName(group), price: group.price }
}
