'use server'
import { Prisma } from '../../lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const getAllStudentsAction = async () => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('غير مسجل الدخول')

  // جيب كل الطلاب مع آخر جروب هما فيه (الجروب النشط)
  return await Prisma.student.findMany({
    where: { teacherId: teacher.id },
    include: {
      enrollments: {
        where: {
          // لو عايز بس الجروبات النشطة
          // status: "ACTIVE"
        },
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
