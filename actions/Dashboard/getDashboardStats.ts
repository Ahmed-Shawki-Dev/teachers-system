// actions/Dashboard/getDashboardStats.ts

'use server'

import { Prisma } from '@/lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'
// 🛑 لازم نستدعي الأكشنز المسؤولة عن تجميع الديون
import { PaymentType } from '@prisma/client'
import { unstable_noStore } from 'next/cache' // 👑 لإصلاح مشكلة الـ Vercel Latency
import { getMonthlySheet } from '../Payment/getMonthlySheet'
import { getUnpaidSessions } from '../Payment/getUnpaidSessions'

export const getDashboardStats = async () => {
  unstable_noStore() // 🛑 منع الـ Caching على الداتا الحية

  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Unauthorized')

  const today = new Date()
  const monthKey = `${today.getMonth() + 1}-${today.getFullYear()}`
  const currentMonth = today.getMonth() // استخدمه في تحديد بداية ونهاية الشهر الحالي

  // 1. الأعداد (طلاب ومجموعات) - بدون تغيير
  const studentsCount = await Prisma.student.count({
    where: { teacherId: teacher.id ,isArchived:false},
  })

  const groupsCount = await Prisma.group.count({
    where: { teacherId: teacher.id },
  })

  // 2. حصص اليوم - بدون تغيير
  const startOfDay = new Date(today.setHours(0, 0, 0, 0))
  const endOfDay = new Date(today.setHours(23, 59, 59, 999))

  const todayClasses = await Prisma.session.findMany({
    where: {
      group: { teacherId: teacher.id },
      sessionDate: { gte: startOfDay, lte: endOfDay },
      status: { not: 'CANCELED' },
    },
    include: { group: true },
    orderBy: { sessionDate: 'asc' },
  })

  // 3. التحصيل الفعلي للشهر الحالي - (إعادة تعيين اليوم عشان الحسابات اللي فوق تكون سليمة)
  const startOfMonth = new Date(today.getFullYear(), currentMonth, 1)
  const endOfMonth = new Date(today.getFullYear(), currentMonth + 1, 0)

  const currentMonthIncome = await Prisma.payment.aggregate({
    where: {
      group: { teacherId: teacher.id },
      date: { gte: startOfMonth, lte: endOfMonth },
    },
    _sum: { amount: true },
  })

  // 4. داتا الرسم البياني - بدون تغيير
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)

  const payments = await Prisma.payment.findMany({
    where: {
      group: { teacherId: teacher.id },
      date: { gte: sixMonthsAgo },
    },
    select: { amount: true, date: true },
  })

  const monthlyMap = new Map<string, number>()
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const monthName = d.toLocaleDateString('ar-EG', { month: 'short' })
    monthlyMap.set(monthName, 0)
  }
  payments.forEach((p) => {
    const monthName = new Date(p.date).toLocaleDateString('ar-EG', { month: 'short' })
    const current = monthlyMap.get(monthName) || 0
    monthlyMap.set(monthName, current + p.amount)
  })
  const chartData = Array.from(monthlyMap.entries()).map(([name, total]) => ({
    name,
    total,
  }))

  // 👑 5. تجميع المستحقات المتأخرة (الـ Financial Killer Feature)

  const allTeacherGroups = await Prisma.group.findMany({
    where: { teacherId: teacher.id },
    select: { id: true, paymentType: true, price: true },
  })

  // 👑 استخدام Promise.all لقتل الـ Waterfall و تنفيذ الـ Queries بالتوازي
  const debtPromises = allTeacherGroups.map(async (group) => {
    if (group.paymentType === PaymentType.PER_SESSION) {
      // لوجيك الدفع بالحصة (تراكمي)
      const debtSummary = await getUnpaidSessions(group.id)
      return {
        pendingAmount: debtSummary.debtList.reduce((sum, s) => sum + s.totalDebt, 0),
        laggardsCount: debtSummary.debtList.length,
      }
    } else if (group.paymentType === PaymentType.MONTHLY) {
      // لوجيك الدفع الشهري (للشهر الحالي فقط)
      const monthlySheet = await getMonthlySheet(group.id, monthKey)
      const unpaidMonthlyStudents = monthlySheet.sheet.filter((s) => !s.isPaid)

      return {
        pendingAmount: unpaidMonthlyStudents.reduce((sum, s) => sum + s.amount, 0),
        laggardsCount: unpaidMonthlyStudents.length,
      }
    }
    return { pendingAmount: 0, laggardsCount: 0 }
  })

  const allDebts = await Promise.all(debtPromises)

  const totalPendingAmount = allDebts.reduce((sum, debt) => sum + debt.pendingAmount, 0)
  const totalLaggardStudents = allDebts.reduce((sum, debt) => sum + debt.laggardsCount, 0)

  // 👑 6. الـ Return Statement النهائي (هنا ضفنا الحقول الجديدة)
  return {
    studentsCount,
    groupsCount,
    todayClassesCount: todayClasses.length,
    todayClasses,
    currentMonthIncome: currentMonthIncome._sum.amount || 0,
    chartData,
    totalPendingAmount, // 🛑 ده اللي كان ناقص
    totalLaggardStudents, // 🛑 وده كمان
  }
}
