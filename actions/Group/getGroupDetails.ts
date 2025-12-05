'use server'
import { Prisma } from '@/lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const getGroupDetails = async (groupId: string) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Unauthorized')

  const group = await Prisma.group.findUnique({
    where: { id: groupId },
    include: {
      schedule: true, 
      _count: { select: { enrollments: true } }, 
    },
  })


  if (!group || group.teacherId !== teacher.id) {
    throw new Error('المجموعة غير موجودة')
  }

  return group
}
