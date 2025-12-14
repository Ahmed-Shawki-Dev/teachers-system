'use server'
import { Prisma } from '@/lib/prisma'
import { Prisma as PrismaClient } from '@prisma/client'

import { unstable_noStore as noStore } from 'next/cache'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const getAllStudentsAction = async (
  page: number = 1,
  pageSize: number = 25,
  query: string = '',
  groupId: string = '',
) => {
  noStore()
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Unauthorized')

  const skip = (page - 1) * pageSize

  const whereCondition: PrismaClient.StudentWhereInput = {
    teacherId: teacher.id,
    isArchived: false,
  }

  if (groupId && groupId !== 'all') {
    whereCondition.enrollments = {
      some: { groupId: groupId },
    }
  }

  if (query) {
    whereCondition.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { studentCode: { contains: query, mode: 'insensitive' } },
      { parentPhone: { contains: query, mode: 'insensitive' } },
    ]
  }

  try {
    const [students, totalCount] = await Promise.all([
      Prisma.student.findMany({
        where: whereCondition,
        skip: skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          enrollments: {
            // 👇👇👇 التعديل هنا يا هندسة 👇👇👇
            include: {
              group: {
                select: {
                  name: true, // الاسم الفرعي (ممكن يكون null)
                  grade: true, // الصف الدراسي (ده المهم والأساسي)
                },
              },
            },
          },
        },
      }),
      Prisma.student.count({
        where: whereCondition,
      }),
    ])

    return {
      data: students,
      metadata: {
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        currentPage: page,
      },
    }
  } catch (error) {
    console.error('Error fetching students:', error)
    return {
      data: [],
      metadata: { totalCount: 0, totalPages: 0, currentPage: 1 },
    }
  }
}
