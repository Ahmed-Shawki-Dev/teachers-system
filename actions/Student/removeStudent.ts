'use server'
import { revalidatePath } from 'next/cache'
import { Prisma } from '../../lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const removeStudentAction = async (id: string) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Not authenticated')

  const student = await Prisma.student.findUnique({ where: { id } })
  if (!student) throw new Error('Student not found')
  if (student.teacherId !== teacher.id) throw new Error('Unauthorized')

  await Prisma.student.delete({ where: { id } })
  revalidatePath('/dashboard/students')
}
