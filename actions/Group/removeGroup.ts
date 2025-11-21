'use server'
import { revalidatePath } from 'next/cache'
import { Prisma } from '../../lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const removeGroupAction = async (id: string) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Not authenticated')

  const group = await Prisma.group.findUnique({ where: { id } })
  if (!group) throw new Error('Student not found')
  if (group.teacherId !== teacher.id) throw new Error('Unauthorized')

  await Prisma.group.delete({ where: { id } })
  revalidatePath('/dashboard/groups')
}
