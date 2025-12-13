'use server'

import { Prisma } from '@/lib/prisma'

export const getSessionAttendance = async (sessionId: string) => {
  // 1. هات بيانات الحصة والجروب عشان نعرف الطلاب
  const session = await Prisma.session.findUnique({
    where: { id: sessionId },
    include: { group: true },
  })

  if (!session) throw new Error('Session not found')

  // 2. هات كل طلاب الجروب ده (بشرط ميكونوش محذوفين/أرشيف)
  const students = await Prisma.student.findMany({
    where: {
      enrollments: { some: { groupId: session.groupId } },
      isArchived: false, // 👈👈👈 دي الإضافة السحرية: اخفي المحذوفين من القائمة
    },
    select: {
      id: true,
      name: true,
      parentPhone: true,
      studentCode: true,
    },
    orderBy: { name: 'asc' },
  })

  // 3. هات سجل الحضور القديم (لو اتخد قبل كده)
  const existingAttendance = await Prisma.attendance.findMany({
    where: { sessionId },
  })

  // خريطة سريعة عشان نعرف حالة كل طالب
  const attendanceMap = new Map(existingAttendance.map((a) => [a.studentId, a]))

  // 4. هات المدفوعات للحصة دي
  const payments = await Prisma.payment.findMany({
    where: { sessionId },
  })
  const paymentMap = new Set(payments.map((p) => p.studentId))

  // 5. دمج البيانات
  const formattedStudents = students.map((student) => {
    const record = attendanceMap.get(student.id)

    return {
      studentId: student.id,
      name: student.name,
      studentCode: student.studentCode,
      parentPhone: student.parentPhone,
      status: record ? record.status : null, // لو مفيش، رجع null عشان الفرونت يفهم إن لسه ماتخدش
      note: record?.note || '',
      hasPaid: paymentMap.has(student.id),
    }
  })

  return {
    groupName: session.group.name,
    sessionDate: session.sessionDate,
    price: session.group.price,
    paymentType: session.group.paymentType,
    students: formattedStudents,
  }
}
