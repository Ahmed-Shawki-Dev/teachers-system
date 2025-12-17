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
    // Logic التوليد الآمن للكود
    let nextCode: string
    let isCodeUnique = false

    do {
      nextCode = generateRandomCode()
      const existingStudent = await tx.student.findFirst({
        where: { studentCode: nextCode },
        select: { id: true },
      })

      if (!existingStudent) isCodeUnique = true
    } while (!isCodeUnique)

    // 1. إضافة الطالب
    const student = await tx.student.create({
      data: {
        ...studentData,
        teacherId: teacher.id,
        studentCode: nextCode,
      },
    })

    // 2. تسجيله في الجروب
    await tx.enrollment.create({
      data: {
        studentId: student.id,
        groupId: groupId,
      },
    })

    revalidatePath('/dashboard/students')

    // ✅ التعديل هنا: بنرجع صلاحية المدرس في الطباعة
    // بنشوف لو هو مفعل خاصية الباركود (اللي ضفناها في السكيما قبل كدة)
    return {
      student,
      studentCode: nextCode,
      allowPrinting: teacher.hasBarcodeScanner, 
    }
  })
}
