'use server'
import { revalidatePath } from 'next/cache'
import { Prisma } from '../../lib/prisma'
import { IGroup } from '../../validation/groupSchema'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const addGroupAction = async (data: IGroup) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Not authenticated')

  const { name, schedule } = data

  await Prisma.group.create({
    data: {
      name,
      teacherId: teacher.id,
      schedule: {
        create:
          schedule?.map((item) => ({
            dayOfWeek: item.dayOfWeek,
            startTime: item.startTime,
            endTime: item.endTime,
          })) || [], 
      },
    },
  })

  revalidatePath('/dashboard/groups')
}
