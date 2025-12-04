'use server'
import { Prisma } from '../../lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const getAllStudentsAction = async (
  searchTerm?: string,
  groupId?: string,
  grade?: string,
) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('غير مسجل الدخول')

  return await Prisma.student.findMany({
    where: {
      teacherId: teacher.id,

      // التعديل هنا: البحث بالاسم فقط (شيلنا الـ OR ورقم التليفون)
      name: searchTerm ? { contains: searchTerm, mode: 'insensitive' } : undefined,

      enrollments: {
        some: {
          groupId: groupId && groupId !== 'all' ? groupId : undefined,
          group:
            grade && grade !== 'all'
              ? {
                  name: { contains: grade },
                }
              : undefined,
        },
      },
    },

    include: {
      enrollments: {
        include: {
          group: {
            select: {
              name: true,
            },
          },
        },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}
