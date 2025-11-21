// actions/Student/updateStudentAndEnroll.ts
'use server'
import { Prisma } from "../../lib/prisma"
import { getTeacherByTokenAction } from "../Teacher/getTeacherByToken"

export async function updateStudentAndEnrollAction(
  studentId: string,
  data: {
    name: string
    parentPhone: string
    groupId: string
  },
) {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('غير مسجل الدخول')

  // تأكد إن الطالب بتاع المدرس
  const student = await Prisma.student.findFirst({
    where: { id: studentId, teacherId: teacher.id },
  })
  if (!student) throw new Error('الطالب مش موجود أو مش بتاعك')

  // تأكد إن الجروب الجديد بتاع المدرس
  const group = await Prisma.group.findFirst({
    where: { id: data.groupId, teacherId: teacher.id },
  })
  if (!group) throw new Error('الجروب مش موجود أو مش بتاعك')

  return await Prisma.$transaction(async (tx) => {
    // 1. عدّل بيانات الطالب
    const updatedStudent = await tx.student.update({
      where: { id: studentId },
      data: {
        name: data.name,
        parentPhone: data.parentPhone,
      },
    })

    // 2. شوف لو فيه enrollment قديم له في جروب تاني → عدّله
    const existingEnrollment = await tx.enrollment.findUnique({
      where: { studentId_groupId: { studentId, groupId: data.groupId } },
    })

    if (existingEnrollment) {
      // لو هو في نفس الجروب → خلاص مفيش حاجة نعملها
      return updatedStudent
    }

    // لو في جروب تاني → امسح القديم واعمل واحد جديد
    await tx.enrollment.deleteMany({
      where: { studentId },
    })

    await tx.enrollment.create({
      data: {
        studentId,
        groupId: data.groupId,
      },
    })

    return updatedStudent
  })
}
