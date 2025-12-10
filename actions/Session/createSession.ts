'use server'

import { Prisma } from '@/lib/prisma'
import { SessionStatus } from '@prisma/client' // استوردنا الـ Enum
import { revalidatePath } from 'next/cache'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

// ضفنا باراميتر جديد: status
export const createSessionAction = async (
  groupId: string,
  dateString: string,
  status: SessionStatus = 'SCHEDULED', // القيمة الافتراضية
) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('غير مصرح لك')

  const sessionDate = new Date(dateString)
  const startOfDay = new Date(sessionDate)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(sessionDate)
  endOfDay.setHours(23, 59, 59, 999)

  // 1. التحقق
  const existingSession = await Prisma.session.findFirst({
    where: {
      groupId,
      sessionDate: { gte: startOfDay, lte: endOfDay },
    },
  })

  if (existingSession) {
    return { success: false, message: 'تم اتخاذ إجراء لهذه الحصة مسبقاً' }
  }

  // 2. الإنشاء بالحالة المطلوبة
  await Prisma.session.create({
    data: {
      groupId,
      sessionDate,
      status: status, // <--- هنا التغيير: بنسجل الحالة اللي جاية من الزرار
    },
  })

  revalidatePath('/dashboard/sessions')

  // رسالة ذكية حسب الحالة
  const msg = status === 'CANCELED' ? 'تم إلغاء الحصة 🔕' : 'تم بدء الحصة بنجاح 🚀'
  return { success: true, message: msg }
}
