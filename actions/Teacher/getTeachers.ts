'use server'
import { Prisma } from '../../lib/prisma'

export const getAllTeachersAction = async () => {
  return await Prisma.teacher.findMany()
}
