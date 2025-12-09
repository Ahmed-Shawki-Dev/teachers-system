'use server'

import { Prisma } from '@/lib/prisma'
import { AttendanceStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { getTeacherByTokenAction } from '../../../../actions/Teacher/getTeacherByToken'

// 1. تحديث النوع لاستقبال حالة الدفع
type AttendanceInput = {
  studentId: string
  status: AttendanceStatus
  note?: string
  hasPaid?: boolean // 👈 دي الجديدة
}

export const upsertAttendanceAction = async (
  sessionId: string,
  attendanceData: AttendanceInput[],
  groupPrice: number, // 👈 المعامل الثالث
  isPerSession: boolean, // 👈 المعامل الرابع
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

  // 3. التنفيذ داخل Transaction
  await Prisma.$transaction(async (tx) => {
    for (const record of attendanceData) {
      // أ. تسجيل الغياب (زي ما كان)
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

      // ب. لو المجموعة بالحصة: تعامل مع الفلوس
      if (isPerSession) {
        if (record.hasPaid) {
          // لو علمنا إنه دفع:
          // نتأكد الأول إنه مدفعش قبل كدة لنفس الحصة عشان التكرار
          const existingPayment = await tx.payment.findFirst({
            where: {
              sessionId: sessionId,
              studentId: record.studentId,
            },
          })

          // لو مش موجود، سجله
          if (!existingPayment) {
            await tx.payment.create({
              data: {
                amount: groupPrice,
                type: 'PER_SESSION',
                date: new Date(), // تاريخ الدفع هو دلوقتي
                studentId: record.studentId,
                groupId: session.groupId,
                sessionId: sessionId, // ربطناه بالحصة
              },
            })
          }
        } else {
          // لو شلنا علامة الدفع (أو هو مدفعش أصلاً):
          // امسح أي عملية دفع مسجلة للحصة دي (عشان لو كان دفع ورجعنا في كلامنا)
          await tx.payment.deleteMany({
            where: {
              sessionId: sessionId,
              studentId: record.studentId,
            },
          })
        }
      }
    }

    // ج. تحديث حالة الحصة لـ "تمت"
    await tx.session.update({
      where: { id: sessionId },
      data: { status: 'COMPLETED' },
    })
  })

  revalidatePath(`/dashboard/sessions/${sessionId}`)
  revalidatePath('/dashboard/sessions')

  return { success: true, message: 'تم حفظ الغياب والماليات بنجاح ✅' }
}
