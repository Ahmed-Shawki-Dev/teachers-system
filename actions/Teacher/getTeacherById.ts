'use server'
import { Prisma } from '../../lib/prisma'

export const getTeacherByIdAction = async (userId: string) => {
  return await Prisma.teacher.findUnique({
    where: {
      id: userId,
    },
  })
}
