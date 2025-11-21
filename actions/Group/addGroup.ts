'use server'
import { revalidatePath } from 'next/cache'
import { Prisma } from '../../lib/prisma'
import { IGroup } from '../../validation/groupSchema'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const addGroupAction = async (data: IGroup) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Not authenticated')

  await Prisma.group.create({
    data: {
      ...data,
      teacherId: teacher.id,
    },
  })

  revalidatePath('/dashboard/groups')
}
