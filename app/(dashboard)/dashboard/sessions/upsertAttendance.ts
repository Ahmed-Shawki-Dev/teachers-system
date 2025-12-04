'use server'

import { Prisma } from '@/lib/prisma'
import { AttendanceStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { getTeacherByTokenAction } from '../../../../actions/Teacher/getTeacherByToken'

// نوع البيانات اللي الأكشن هيستلمها من الـ UI
type AttendanceInput = {
  studentId: string
  status: AttendanceStatus
  note?: string
}

export const upsertAttendanceAction = async (
  sessionId: string,
  attendanceData: AttendanceInput[],
) => {
  // 1. أمان: تأكد من المدرس
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('غير مصرح لك')

  // 2. التحقق من أن الحصة تخص هذا المدرس
  const session = await Prisma.session.findUnique({
    where: { id: sessionId },
    include: { group: true },
  })

  if (!session || session.group.teacherId !== teacher.id) {
    throw new Error('لا يمكنك تعديل هذه الحصة')
  }

  // 3. التنفيذ داخل Transaction عشان نضمن إن كله يتسجل أو لا شيء
  await Prisma.$transaction(async (tx) => {
    // أ. تسجيل غياب كل طالب
    for (const record of attendanceData) {
      await tx.attendance.upsert({
        where: {
          sessionId_studentId: {
            sessionId: sessionId,
            studentId: record.studentId,
          },
        },
        update: {
          status: record.status,
          note: record.note,
        },
        create: {
          sessionId: sessionId,
          studentId: record.studentId,
          status: record.status,
          note: record.note,
        },
      })
    }

    // ب. تحديث حالة الحصة لـ "تمت"
    await tx.session.update({
      where: { id: sessionId },
      data: { status: 'COMPLETED' },
    })
  })

  revalidatePath(`/dashboard/sessions/${sessionId}`)
  revalidatePath('/dashboard/sessions') // عشان الكارت بره يبقى لونه أخضر

  return { success: true, message: 'تم حفظ الغياب بنجاح ✅' }
}
