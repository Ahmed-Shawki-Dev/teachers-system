'use server'
import { Prisma } from '../../lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const getAllGroupsAction = async () => {
  const teacher = await getTeacherByTokenAction()

  if (!teacher) throw new Error('Invalid token')

  return await Prisma.group.findMany({
    where: { teacherId: teacher.id },
    orderBy: { createdAt: 'desc' },
  })
}
