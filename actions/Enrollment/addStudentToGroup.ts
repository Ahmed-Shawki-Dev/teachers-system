'use server'

import { revalidatePath } from 'next/cache'
import { Prisma } from '../../lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export async function addStudentAndEnrollAction(data: {
  name: string
  parentPhone: string
  groupId: string
}) {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('غير مسجل الدخول')

  const group = await Prisma.group.findFirst({
    where: { id: data.groupId, teacherId: teacher.id },
  })
  if (!group) throw new Error('الجروب مش موجود أو مش بتاعك')

  return await Prisma.$transaction(async (tx) => {
    // 1. أضف الطالب
    const student = await tx.student.create({
      data: {
        name: data.name,
        parentPhone: data.parentPhone,
        teacherId: teacher.id,
      },
    })

    // 2. سجله في الجروب فورًا
    await tx.enrollment.create({
      data: {
        studentId: student.id,
        groupId: data.groupId,
      },
    })

    revalidatePath('/dashboard/students')
    return student
  })
}
