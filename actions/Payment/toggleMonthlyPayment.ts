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

  // 🛡️ SECURITY GUARD: Backend Validation
  // لازم نفك الـ Key ونشوف السنة
  const parts = monthKey.split('-') // ["10", "2031"]
  if (parts.length !== 2) throw new Error('Invalid format')

  const year = parseInt(parts[1])
  const currentYear = new Date().getFullYear()

  // لو السنة أكبر من السنة الجاية أو أقل من اللي فاتت -> بلوك
  if (year > currentYear + 1 || year < currentYear - 1) {
    throw new Error('محاولة تلاعب بالتاريخ مرفوضة')
  }

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
        date: new Date(), // تاريخ الدفع الحقيقي هو "الآن"
        studentId,
        groupId,
        monthKey, // الشهر اللي بيدفع عشانه (بعد ما اتأكدنا إنه سليم)
      },
    })
    revalidatePath('/dashboard/payments', 'page')
    return { status: 'paid', message: 'تم التحصيل بنجاح ✅' }
  }
}
