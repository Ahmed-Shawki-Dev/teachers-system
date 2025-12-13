'use server'

import { Prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

// مش محتاجين groupId هنا لأننا هنسوي ديون الطالب في كل المجاميع (Global Settlement)
export async function settleStudentDebt(studentId: string) {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Unauthorized')

  // 1. هات الطالب وكل تاريخه (حضور ومدفوعات)
  const student = await Prisma.student.findUnique({
    where: { id: studentId },
    include: {
      attendances: {
        where: {
          status: 'PRESENT',
          session: {
            group: { teacherId: teacher.id, paymentType: 'PER_SESSION' },
          },
        },
        include: {
          session: {
            include: { group: true }, // عشان نجيب سعر الحصة وتفاصيل الجروب بتاعها
          },
        },
      },
      payments: {
        where: {
          type: 'PER_SESSION',
          group: { teacherId: teacher.id },
        },
      },
    },
  })

  if (!student) throw new Error('Student not found')

  // 2. طلع الحصص اللي مدفعتش (نفس لوجيك العرض بالظبط)
  const paidSessionIds = student.payments.filter((p) => p.sessionId).map((p) => p.sessionId)

  const unpaidSessions = student.attendances.filter((a) => !paidSessionIds.includes(a.session.id))

  if (unpaidSessions.length === 0) {
    return { success: true, message: 'لا توجد ديون لتسويتها' }
  }

  // 3. اعمل Loop واعمل Payment لكل حصة لوحدها
  // ده اللي هيخلي العداد يصفر لأن كل Attendance هيلاقي الـ Payment بتاعه
  await Prisma.$transaction(
    unpaidSessions.map((attendance) =>
      Prisma.payment.create({
        data: {
          amount: attendance.session.group.price, // سعر الحصة وقتها
          date: new Date(),
          type: 'PER_SESSION',
          studentId: student.id,
          groupId: attendance.session.groupId, // ادفعها في الجروب بتاعها الأصلي
          sessionId: attendance.session.id, // <--- ده المفتاح السحري
          note: `تسوية تلقائية لحصة يوم ${attendance.session.sessionDate.toLocaleDateString(
            'ar-EG',
          )}`,
        },
      }),
    ),
  )

  revalidatePath('/dashboard/payments')
  revalidatePath('/dashboard/students')

  return { success: true, count: unpaidSessions.length }
}
