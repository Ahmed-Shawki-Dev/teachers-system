'use server'

import { Prisma } from '@/lib/prisma'
import { IGroupInput } from '@/validation/groupSchema'
import { revalidatePath } from 'next/cache'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'
import { DayOfWeek, PaymentType } from '@prisma/client'

export const addGroupAction = async (data: IGroupInput) => {
  try {
    const teacher = await getTeacherByTokenAction()
    if (!teacher) return { success: false, message: 'غير مصرح لك' }

    // إنشاء المجموعة + المواعيد في خطوة واحدة
    await Prisma.group.create({
      data: {
        grade: data.grade, // NEW: أضفنا الصف الدراسي
        name: data.name, // MODIFIED: الاسم التفصيلي (هيجي null/undefined لو مش موجود وده طبيعي)
        price: data.price,
        paymentType: data.paymentType as PaymentType,
        teacherId: teacher.id,

        // 👇 السحر هنا: بنفك مصفوفة المواعيد ونعملها create
        schedule: {
          create: data.schedule.map((s) => ({
            dayOfWeek: s.dayOfWeek as DayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
          })),
        },
      },
    })

    revalidatePath('/dashboard/groups')
    return { success: true, message: 'تمت الإضافة بنجاح' }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'حدث خطأ في السيرفر' }
  }
}
