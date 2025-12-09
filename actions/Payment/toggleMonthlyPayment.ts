'use server'

import { Prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const toggleMonthlyPayment = async (
  studentId: string,
  groupId: string,
  monthKey: string,
  amount: number,
) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Unauthorized')

  const existing = await Prisma.payment.findFirst({
    where: { studentId, groupId, monthKey },
  })

  if (existing) {
    await Prisma.payment.delete({ where: { id: existing.id } })
    revalidatePath('/dashboard/payments')
    return { status: 'unpaid', message: 'تم إلغاء الدفع ❌' }
  } else {
    await Prisma.payment.create({
      data: {
        amount,
        type: 'MONTHLY',
        date: new Date(),
        studentId,
        groupId,
        monthKey,
      },
    })
    revalidatePath('/dashboard/payments')
    return { status: 'paid', message: 'تم التحصيل بنجاح ✅' }
  }
}
