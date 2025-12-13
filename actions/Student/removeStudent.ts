'use server'
import { revalidatePath } from 'next/cache'
import { Prisma } from '../../lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const removeStudentAction = async (id: string) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Not authenticated')

  // التعديل: شلنا سطر enrollments: { deleteMany: {} }
  // كده الطالب هيفضل مربوط بالمجموعة، وحساباته هتفضل ظاهرة
  await Prisma.student.update({
    where: { id },
    data: {
      isArchived: true,
    },
  })

  revalidatePath('/dashboard/students')
  revalidatePath('/dashboard/payments') // مهم عشان يحدث الفلوس
}
