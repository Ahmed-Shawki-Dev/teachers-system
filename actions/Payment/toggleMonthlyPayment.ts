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

  // ... (نفس كود التأكد من التاريخ) ...
  const parts = monthKey.split('-')
  if (parts.length !== 2) throw new Error('Invalid format')
  const year = parseInt(parts[1])
  const currentYear = new Date().getFullYear()

  if (year > currentYear + 1 || year < currentYear - 1) {
    throw new Error('محاولة تلاعب بالتاريخ مرفوضة')
  }

  // 👇👇👇 التعديل هنا 👇👇👇
  // دور على دفع للشهر ده للطالب ده "عند المدرس ده"، بغض النظر عن الجروب
  const existing = await Prisma.payment.findFirst({
    where: {
      studentId,
      monthKey,
      group: { teacherId: teacher.id }, // السر هنا
    },
  })

  if (existing) {
    // لو لقيت دفع (سواء في الجروب ده أو القديم) امسحه
    await Prisma.payment.delete({ where: { id: existing.id } })
    revalidatePath('/dashboard/payments')
    return { status: 'unpaid', message: 'تم إلغاء الدفع ❌' }
  } else {
    // لو ملقيتش، سجل دفع جديد "في الجروب الحالي"
    await Prisma.payment.create({
      data: {
        amount,
        type: 'MONTHLY',
        date: new Date(),
        studentId,
        groupId, // هنسجل الدفع باسم الجروب الجديد بقى خلاص
        monthKey,
      },
    })
    revalidatePath('/dashboard/payments', 'page')
    return { status: 'paid', message: 'تم التحصيل بنجاح ✅' }
  }
}
