'use server'
import { revalidatePath } from 'next/cache'
import { Prisma } from '../../lib/prisma'
import { IGroup } from '../../validation/groupSchema'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const updateGroupAction = async (id: string, data: IGroup) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('غير مصرح لك')

  const student = await Prisma.group.findUnique({ where: { id } })
  if (!student) throw new Error('المجموعة غير موجود')

  if (student.teacherId !== teacher.id) throw new Error('غير مصرح لك بتعديل هذه المجموعة')

  await Prisma.group.update({
    where: { id },
    data: {
      ...data,
    },
  })

  revalidatePath('/dashboard/groups')
}
