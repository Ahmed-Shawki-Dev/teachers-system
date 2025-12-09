'use server'

import { Prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const settleStudentDebt = async (studentId: string, groupId: string) => {
  try {
    const teacher = await getTeacherByTokenAction()
    if (!teacher) throw new Error('Unauthorized')

    // 1. هات سعر الحصة
    const group = await Prisma.group.findUnique({
      where: { id: groupId },
      select: { price: true, teacherId: true },
    })

    if (!group || group.teacherId !== teacher.id) throw new Error('غير مصرح')

    // 2. هات كل الحصص اللي الطالب حضرها في الجروب ده
    const attendance = await Prisma.attendance.findMany({
      where: {
        studentId,
        status: 'PRESENT',
        session: { groupId },
      },
      select: { sessionId: true },
    })

    const attendedSessionIds = attendance.map((a) => a.sessionId)

    // 3. هات الحصص اللي مدفوعلها فلوس بالفعل
    const existingPayments = await Prisma.payment.findMany({
      where: {
        studentId,
        groupId,
        type: 'PER_SESSION',
        sessionId: { in: attendedSessionIds },
      },
      select: { sessionId: true },
    })

    const paidSessionIds = existingPayments.map((p) => p.sessionId)

    // 4. طلع الفرق (الحصص اللي حضرها - اللي دفعها) = المديونية
    const unpaidSessionIds = attendedSessionIds.filter(
      (id) => id !== null && !paidSessionIds.includes(id),
    )

    if (unpaidSessionIds.length === 0) {
      return { success: true, message: 'الطالب ليس عليه متأخرات' }
    }

    // 5. سجل دفع لكل الحصص المتأخرة دي (Bulk Create)
    await Prisma.payment.createMany({
      data: unpaidSessionIds.map((sessionId) => ({
        amount: group.price,
        date: new Date(),
        type: 'PER_SESSION',
        studentId,
        groupId,
        sessionId,
      })),
    })

    // تحديث الصفحة عشان الطالب يختفي من القائمة
    revalidatePath('/dashboard/payments')

    return { success: true, message: `تم تسديد ${unpaidSessionIds.length} حصة بنجاح ✅` }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'حدث خطأ أثناء التسديد' }
  }
}
