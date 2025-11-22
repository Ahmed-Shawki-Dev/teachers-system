'use server'
import { revalidatePath } from 'next/cache'
import { Prisma } from '../../lib/prisma'
import { IGroup } from '../../validation/groupSchema'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const updateGroupAction = async (id: string, data: IGroup) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('غير مصرح لك')

  const group = await Prisma.group.findUnique({ where: { id } })
  if (!group) throw new Error('المجموعة غير موجود')

  if (group.teacherId !== teacher.id) throw new Error('غير مصرح لك بتعديل هذه المجموعة')

  await Prisma.classSchedule.deleteMany({
    where: { groupId: id },
  })

  await Prisma.group.update({
    where: { id },
    data: {
      name: data.name,
      schedule: {
        create: data?.schedule?.map((item) => ({
          dayOfWeek: item.dayOfWeek,
          startTime: item.startTime,
          endTime: item.endTime,
        })),
      },
    },
  })

  revalidatePath('/dashboard/groups')
}
