'use server'
import { revalidatePath } from 'next/cache'
import { Prisma } from '../../lib/prisma'
import { IStudent } from '../../validation/studentSchema'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const updateStudentAction = async (id: string, data: IStudent) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('غير مصرح لك')

  const student = await Prisma.student.findUnique({ where: { id } })
  if (!student) throw new Error('الطالب غير موجود')

  if (student.teacherId !== teacher.id) throw new Error('غير مصرح لك بتعديل هذا الطالب')

  await Prisma.student.update({
    where: { id },
    data: {
      ...data,
    },
  })

  revalidatePath('/dashboard/students')
}
