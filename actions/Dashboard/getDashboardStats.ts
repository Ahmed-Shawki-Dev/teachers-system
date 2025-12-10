'use server'

import { Prisma } from '@/lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const getDashboardStats = async () => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Unauthorized')

  // 1. الأعداد (طلاب ومجموعات)
  const studentsCount = await Prisma.student.count({
    where: { teacherId: teacher.id },
  })

  const groupsCount = await Prisma.group.count({
    where: { teacherId: teacher.id },
  })

  // 2. حصص اليوم (النشطة فقط - بنستبعد الملغي CANCELED)
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0))
  const endOfDay = new Date(today.setHours(23, 59, 59, 999))

  const todayClasses = await Prisma.session.findMany({
    where: {
      group: { teacherId: teacher.id },
      sessionDate: { gte: startOfDay, lte: endOfDay },
      status: { not: 'CANCELED' }, // 👈 التأكد من الاسم في السكيما
    },
    include: { group: true },
    orderBy: { sessionDate: 'asc' },
  })

  // 3. التحصيل الفعلي للشهر الحالي (Actual Income)
  // بنجمع اللي دخل جدول Payment فعلياً للمدرس ده
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  const currentMonthIncome = await Prisma.payment.aggregate({
    where: {
      group: { teacherId: teacher.id },
      date: { gte: startOfMonth, lte: endOfMonth },
    },
    _sum: { amount: true },
  })

  // 4. داتا الرسم البياني (تحصيل فعلي لآخر 6 شهور)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5) // 5 شهور فاتوا + الشهر ده

  const payments = await Prisma.payment.findMany({
    where: {
      group: { teacherId: teacher.id },
      date: { gte: sixMonthsAgo },
    },
    select: { amount: true, date: true },
  })

  // تجميع الداتا (شهر: مبلغ)
  const monthlyMap = new Map<string, number>()

  // تهيئة الشهور بصفر عشان لو شهر مفيهوش شغل يظهر 0
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const monthName = d.toLocaleDateString('ar-EG', { month: 'short' })
    monthlyMap.set(monthName, 0)
  }

  // ملء الأرقام الحقيقية
  payments.forEach((p) => {
    const monthName = new Date(p.date).toLocaleDateString('ar-EG', { month: 'short' })
    const current = monthlyMap.get(monthName) || 0
    monthlyMap.set(monthName, current + p.amount)
  })

  const chartData = Array.from(monthlyMap.entries()).map(([name, total]) => ({
    name,
    total,
  }))

  return {
    studentsCount,
    groupsCount,
    todayClassesCount: todayClasses.length,
    todayClasses,
    currentMonthIncome: currentMonthIncome._sum.amount || 0, // الرقم المظبوط
    chartData,
  }
}
