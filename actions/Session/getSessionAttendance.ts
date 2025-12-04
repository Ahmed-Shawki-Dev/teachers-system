'use server'
import { Prisma } from '@/lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const getSessionAttendance = async (sessionId: string) => {
  // 1. أمان: نتأكد إن المدرس هو اللي بيطلب الداتا
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('غير مصرح لك')

  // 2. نجيب بيانات الحصة عشان نعرف هي تبع أنهي مجموعة
  const session = await Prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      group: {
        select: { id: true, name: true, teacherId: true },
      },
    },
  })

  if (!session) throw new Error('الحصة غير موجودة')
  if (session.group.teacherId !== teacher.id) throw new Error('لا تملك صلاحية الوصول لهذه الحصة')

  // 3. نجيب كل الطلاب المسجلين في المجموعة دي
  // ومعاهم "سجل الحضور" الخاص بالحصة دي تحديداً (لو موجود)
  const enrollments = await Prisma.enrollment.findMany({
    where: {
      groupId: session.groupId,
    },
    include: {
      student: {
        include: {
          attendances: {
            where: { sessionId: sessionId }, // التريكاية: هات سجل الحضور للحصة دي بس
          },
        },
      },
    },
    orderBy: { student: { name: 'asc' } }, // رتب الأسماء أبجدياً
  })

  // 4. نجهز الداتا بشكل نضيف للـ UI
  const students = enrollments.map((enrollment) => {
    const student = enrollment.student
    // أول سجل في المصفوفة هو سجل الحضور (لأننا عاملين فلتر بـ sessionId)
    const record = student.attendances[0]

    return {
      studentId: student.id,
      name: student.name,
      parentPhone: student.parentPhone,
      // لو ليه سجل رجع حالته (PRESENT/ABSENT)، لو ملوش رجع null (لسه ماتسجلش)
      status: record?.status || null,
      note: record?.note || '',
    }
  })

  return {
    sessionDate: session.sessionDate,
    groupName: session.group.name,
    status: session.status,
    students,
  }
}
