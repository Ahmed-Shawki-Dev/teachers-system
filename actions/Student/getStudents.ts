'use server'
import { Prisma } from '../../lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const getAllStudentsAction = async () => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('غير مسجل الدخول')

  return await Prisma.student.findMany({
    where: { teacherId: teacher.id },
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
