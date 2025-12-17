'use server'

import { Prisma } from '@/lib/prisma'
import { getTeacherByTokenAction } from './getTeacherByToken'

export async function getSubscriptionStats() {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) return null

  // نعد الطلاب الحاليين
  const currentCount = await Prisma.student.count({
    where: {
      teacherId: teacher.id,
      isArchived: false, 
    },
  })

  // نسبة الاستهلاك
  const percentage = Math.round((currentCount / teacher.maxStudents!) * 100)

  return {
    tier: teacher.tier, // BASIC or PRO
    currentCount,
    maxStudents: teacher.maxStudents,
    percentage: percentage > 100 ? 100 : percentage,
    isLimitReached: currentCount >= teacher.maxStudents!,
    canPrint: teacher.hasBarcodeScanner, // عشان نظهرله هو عنده الميزة دي ولا لأ
  }
}
