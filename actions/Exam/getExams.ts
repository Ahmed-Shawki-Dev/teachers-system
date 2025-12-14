'use server'
import { Prisma } from '../../lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const getExamsAction = async (groupId?: string) => {
  try {
    const teacher = await getTeacherByTokenAction()
    if (!teacher) throw new Error('غير مصرح لك')

    return await Prisma.exam.findMany({
      where: {
        group: { teacherId: teacher.id },
        groupId: groupId && groupId !== 'all' ? groupId : undefined,
      },
      include: {
        group: { select: { name: true,grade:true } },
        _count: { select: { results: true } },
      },
      orderBy: { date: 'desc' },
    })
  } catch (error) {
    console.log(error)
    return [] 
  }
}



export type ExamWithData = Awaited<ReturnType<typeof getExamsAction>>[number]