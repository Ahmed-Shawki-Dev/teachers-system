'use server'
import { Prisma } from '@/lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'
import { IGroupDB } from '@/interfaces/groups' // 1. استورد الانترفيس بتاعك

export const getAllGroupsAction = async () => {
  const teacher = await getTeacherByTokenAction()

  if (!teacher) throw new Error('Invalid token')

  const groups = await Prisma.group.findMany({
    include: {
      schedule: true,
    },
    where: { teacherId: teacher.id },
    orderBy: { createdAt: 'asc' },
  })

  return groups as unknown as IGroupDB[]
}
