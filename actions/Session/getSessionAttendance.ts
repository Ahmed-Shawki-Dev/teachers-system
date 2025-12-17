'use server'

import { Prisma } from '@/lib/prisma'

export const getSessionAttendance = async (sessionId: string) => {
  // 1. هات بيانات الحصة والجروب ومعاهم "المدرس"
  const session = await Prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      group: {
        include: {
          teacher: {
            select: { hasBarcodeScanner: true }, // ✅ هات الخاصية دي بس
          },
        },
      },
    },
  })

  if (!session) throw new Error('Session not found')

  // 2. هات كل طلاب الجروب ده (بشرط ميكونوش محذوفين)
  const students = await Prisma.student.findMany({
    where: {
      enrollments: { some: { groupId: session.groupId } },
      isArchived: false,
    },
    select: {
      id: true,
      name: true,
      parentPhone: true,
      studentCode: true,
    },
    orderBy: { name: 'asc' },
  })

  // 3. هات سجل الحضور القديم
  const existingAttendance = await Prisma.attendance.findMany({
    where: { sessionId },
  })

  const attendanceMap = new Map(existingAttendance.map((a) => [a.studentId, a]))

  // 4. هات المدفوعات
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
      status: record ? record.status : null,
      note: record?.note || '',
      hasPaid: paymentMap.has(student.id),
    }
  })

  const fullGroupName = session.group.name
    ? `${session.group.grade} - ${session.group.name}`
    : session.group.grade

  return {
    groupName: fullGroupName,
    sessionDate: session.sessionDate,
    price: session.group.price,
    paymentType: session.group.paymentType,
    students: formattedStudents,
    // ✅ بنرجع القيمة هنا (لو مش موجودة بنفترض false)
    enableBarcode: session.group.teacher.hasBarcodeScanner ?? false,
  }
}
