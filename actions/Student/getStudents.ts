'use server'
import { Prisma } from '@/lib/prisma'
import { Prisma as PrismaClient } from '@prisma/client'

import { unstable_noStore as noStore } from 'next/cache'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const getAllStudentsAction = async (
  page: number = 1,
  pageSize: number = 25,
  query: string = '',
  groupId: string = '', // ضفنا الجروب عشان الفلتر يشتغل مع السيرش
) => {
  noStore() // ممنوع الكاش هنا
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Unauthorized')

  const skip = (page - 1) * pageSize

  // 🛑 السحر هنا: بناء شرط البحث ديناميكياً
  // بنبدأ بالشرط الأساسي: الطالب تبع المدرس
  const whereCondition: PrismaClient.StudentWhereInput = {
    teacherId: teacher.id,
  }

  // 1. لو فيه فلتر جروب، زود الشرط ده
  if (groupId && groupId !== 'all') {
    whereCondition.enrollments = {
      some: { groupId: groupId },
    }
  }

  // 2. لو فيه كلمة بحث، زود الـ OR Condition
  if (query) {
    whereCondition.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { studentCode: { contains: query, mode: 'insensitive' } },
      { parentPhone: { contains: query, mode: 'insensitive' } },
    ]
  }

  try {
    // التنفيذ: هات الطلاب والعدد في نفس الوقت (Promise.all أسرع)
    const [students, totalCount] = await Promise.all([
      Prisma.student.findMany({
        where: whereCondition,
        skip: skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          enrollments: {
            include: { group: { select: { name: true } } },
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
