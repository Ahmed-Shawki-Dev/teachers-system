'use server'

import { Prisma } from '@/lib/prisma'
import { IGroupInput } from '@/validation/groupSchema'
import { revalidatePath } from 'next/cache'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'
import { DayOfWeek, PaymentType } from '@prisma/client'

export const updateGroupAction = async (groupId: string, data: IGroupInput) => {
  try {
    const teacher = await getTeacherByTokenAction()
    if (!teacher) return { success: false, message: 'غير مصرح لك' }

    const existingGroup = await Prisma.group.findUnique({
      where: { id: groupId },
    })

    if (!existingGroup || existingGroup.teacherId !== teacher.id) {
      return { success: false, message: 'المجموعة غير موجودة أو لا تملك صلاحية تعديلها' }
    }

    await Prisma.group.update({
      where: { id: groupId },
      data: {
        grade: data.grade, // ADDED: Must update grade
        name: data.name,
        price: data.price,
        paymentType: data.paymentType as PaymentType,

        schedule: {
          deleteMany: {},
          create: data.schedule.map((s) => ({
            dayOfWeek: s.dayOfWeek as DayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
          })),
        },
      },
    })

    revalidatePath('/dashboard/groups')
    revalidatePath(`/dashboard/groups/${groupId}`)

    return { success: true, message: 'تم التعديل بنجاح ✅' }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'حدث خطأ أثناء التعديل' }
  }
}
