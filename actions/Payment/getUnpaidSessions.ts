'use server'

import { Prisma } from '@/lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const getUnpaidSessions = async (groupId: string) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Unauthorized')

  // 1. هات الجروب الحالي عشان نتأكد من الملكية والبيانات الأساسية
  const group = await Prisma.group.findUnique({
    where: { id: groupId },
    select: { name: true, price: true, teacherId: true },
  })

  if (!group || group.teacherId !== teacher.id) throw new Error('Unauthorized')

  // 2. هات الطلاب الموجودين حالياً في الجروب ده
  // التغيير هنا: مش بنفلتر الحضور والمدفوعات بالجروب ده بس، بنجيب كله
  const students = await Prisma.student.findMany({
    where: { enrollments: { some: { groupId } } }, // شرط: الطالب مسجل حالياً هنا
    select: {
      id: true,
      name: true,
      parentPhone: true,
      // هات كل الحضور للطالب ده في أي مجموعة تابعة للمدرس، بشرط تكون PRESENT
      attendances: {
        where: {
          status: 'PRESENT',
          session: {
            group: {
              teacherId: teacher.id, // تأكيد إن الحصة تبعك
              paymentType: 'PER_SESSION', // بنحسب ديون الحصة بس
            },
          },
        },
        include: {
          session: {
            include: {
              group: { select: { price: true, name: true } }, // عشان نعرف سعر الحصة وقتها كان كام
            },
          },
        },
      },
      // هات كل مدفوعات الحصص للطالب ده
      payments: {
        where: {
          type: 'PER_SESSION',
          group: { teacherId: teacher.id }, // تبعك برضه
        },
      },
    },
  })

  // 3. فلتر واحسب الديون
  const debtList = students
    .map((student) => {
      // كل الحصص اللي الطالب حضرها في تاريخه مع المدرس (سواء في الجروب ده أو غيره)
      const allAttendedSessions = student.attendances

      // أيديهات الحصص اللي ادفعت بالفعل
      // بنشيك هل الدفع مربوط بـ sessionId موجود في الحصص اللي حضرها ولا لا
      const paidSessionIds = student.payments
        .filter((p) => p.sessionId) // لازم يكون دفع مربوط بحصة
        .map((p) => p.sessionId)

      // الحصص اللي لسه مدفعتش (حضرها - دفعها)
      const unpaidSessions = allAttendedSessions.filter(
        (attendance) => !paidSessionIds.includes(attendance.session.id),
      )

      // حساب إجمالي الدين
      // (مهم جداً: السعر بيتحسب بناء على سعر الجروب اللي الحصة كانت فيه، مش الجروب الحالي)
      const totalDebt = unpaidSessions.reduce((sum, record) => {
        return sum + (record.session.group.price || 0)
      }, 0)

      return {
        studentId: student.id,
        name: student.name,
        phone: student.parentPhone,
        unpaidCount: unpaidSessions.length,
        totalDebt: totalDebt,
        // بنرجع تواريخ الحصص واسم المجموعة اللي كانت فيها عشان تبقى عارف الفلوس دي بتاعت ايه
        details: unpaidSessions.map((a) => ({
          date: a.session.sessionDate,
          groupName: a.session.group.name,
          price: a.session.group.price,
        })),
        unpaidDates: unpaidSessions.map((a) => a.session.sessionDate), // عشان التوافق مع الواجهة القديمة
      }
    })
    .filter((s) => s.unpaidCount > 0) // رجع بس اللي عليه فلوس

  return { debtList, groupName: group.name, price: group.price }
}
