'use server'
import { Prisma } from '@/lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const getSessionAttendance = async (sessionId: string) => {
  // 1. أمان
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('غير مصرح لك')

  // 2. هات بيانات الحصة + بيانات الجروب (السعر والنوع)
  const session = await Prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      group: {
        // 👇 ضفنا price و paymentType
        select: { id: true, name: true, teacherId: true, price: true, paymentType: true },
      },
    },
  })

  if (!session) throw new Error('الحصة غير موجودة')
  if (session.group.teacherId !== teacher.id) throw new Error('لا تملك صلاحية')

  // 3. هات الطلاب + الغياب + الدفع
  const enrollments = await Prisma.enrollment.findMany({
    where: { groupId: session.groupId },
    include: {
      student: {
        include: {
          attendances: { where: { sessionId } }, // سجل الغياب للحصة دي
          payments: { where: { sessionId } }, // 👇 سجل الدفع للحصة دي
        },
      },
    },
    orderBy: { student: { name: 'asc' } },
  })

  // 4. تجهيز الداتا
  const students = enrollments.map((enrollment) => {
    const student = enrollment.student
    const record = student.attendances[0]
    const payment = student.payments[0] // هل في وصل دفع؟

    return {
      studentId: student.id,
      name: student.name,
      parentPhone: student.parentPhone,
      status: record?.status || null,
      note: record?.note || '',
      hasPaid: !!payment, // 👇 لو موجود يبقى ترو
    }
  })

  return {
    sessionDate: session.sessionDate,
    groupName: session.group.name,
    price: session.group.price, // 👇 بنرجع السعر
    paymentType: session.group.paymentType, // 👇 بنرجع النوع
    students,
  }
}
