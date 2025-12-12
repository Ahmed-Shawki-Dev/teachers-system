'use server'

import { revalidatePath } from 'next/cache'
import { Prisma } from '../../lib/prisma'
import { generateRandomCode } from '../../utils/generateRandomCode'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export async function addStudentAndEnrollAction(data: {
  name: string
  parentPhone: string
  groupId: string
}) {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('غير مسجل الدخول')

  const { groupId, ...studentData } = data

  const group = await Prisma.group.findFirst({
    where: { id: groupId, teacherId: teacher.id },
  })
  if (!group) throw new Error('الجروب مش موجود أو مش بتاعك')

  return await Prisma.$transaction(async (tx) => {
    // 🔍 👈 Logic التوليد الآمن الجديد
    let nextCode: string
    let isCodeUnique = false

    // Loop للتأكد من أن الكود فريد عالمياً
    do {
      nextCode = generateRandomCode()
      const existingStudent = await tx.student.findFirst({
        where: { studentCode: nextCode },
        select: { id: true },
      })

      if (!existingStudent) {
        isCodeUnique = true
      }
    } while (!isCodeUnique)
    // 👆 انتهى Logic التوليد الآمن

    // 1. أضف الطالب بالكود الجديد
    const student = await tx.student.create({
      data: {
        ...studentData,
        teacherId: teacher.id,
        studentCode: nextCode,
      },
    })

    // 2. سجله في الجروب فورًا
    await tx.enrollment.create({
      data: {
        studentId: student.id,
        groupId: groupId,
      },
    })

    revalidatePath('/dashboard/students')
    return { student, studentCode: nextCode }
  })
}
