'use server'

import { revalidatePath } from 'next/cache'
import { Prisma } from '../../lib/prisma'
import { ISession, sessionSchema } from '../../validation/sessionSchema'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export async function createSessionAction(data: ISession) {
  // 1. نتأكد مين اللي بيعمل الحصة
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('غير مصرح لك (Not Authenticated)')

  // 2. نتأكد إن البيانات صح
  const validation = sessionSchema.safeParse(data)
  if (!validation.success) {
    throw new Error(validation.error.issues[0].message)
  }

  // 3. نتأكد إن الجروب ده بتاع المدرس
  const group = await Prisma.group.findFirst({
    where: {
      id: data.groupId,
      teacherId: teacher.id,
    },
  })

  if (!group) throw new Error('المجموعة غير موجودة أو مش بتاعتك')

  // 4. نسجل الحصة
  await Prisma.session.create({
    data: {
      sessionDate: data.sessionDate,
      groupId: data.groupId,
      note: data.note,
      status: data.status || 'SCHEDULED',
    },
  })

  // 5. تحديث الصفحة
  revalidatePath('/dashboard/sessions')
}
