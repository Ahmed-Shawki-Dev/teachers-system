'use server'

import { Prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const removeExamAction = async (examId: string) => {
  try {
    const teacher = await getTeacherByTokenAction()
    if (!teacher) throw new Error('Unauthorized')

    // 1. أمان: تأكد إن الامتحان ده تبع مجموعة من مجموعات المدرس
    const exam = await Prisma.exam.findUnique({
      where: { id: examId },
      include: { group: true },
    })

    if (!exam || exam.group.teacherId !== teacher.id) {
      return { success: false, message: 'غير مصرح لك بحذف هذا الامتحان' }
    }

    // 2. الحذف
    await Prisma.exam.delete({
      where: { id: examId },
    })

    revalidatePath('/dashboard/exams')
    return { success: true, message: 'تم حذف الامتحان بنجاح 🗑️' }
  } catch (error) {
    return { success: false, message: 'حدث خطأ أثناء الحذف' }
  }
}
