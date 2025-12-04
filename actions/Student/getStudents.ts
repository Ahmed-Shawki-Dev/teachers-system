'use server'
import { Prisma as PrismaClient } from '@prisma/client'
import { Prisma } from '../../lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const getAllStudentsAction = async (
  searchTerm?: string,
  groupId?: string,
  grade?: string,
) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('غير مسجل الدخول')

  const whereClause: PrismaClient.StudentWhereInput = {
    teacherId: teacher.id,
  }

  if (searchTerm) {
    whereClause.name = { contains: searchTerm, mode: 'insensitive' }
  }

  if ((groupId && groupId !== 'all') || (grade && grade !== 'all')) {
    whereClause.enrollments = {
      some: {
        groupId: groupId && groupId !== 'all' ? groupId : undefined,
        group: grade && grade !== 'all' ? { name: { contains: grade } } : undefined,
      },
    }
  }

  return await Prisma.student.findMany({
    where: whereClause,
    include: {
      enrollments: {
        include: {
          group: { select: { name: true } },
        },
        take: 1,
        orderBy: { id: 'desc' },
      },
    },
    orderBy: { id: 'desc' },
  })
}
