'use server'
import { Prisma } from '@/lib/prisma'
import { getFullGroupName } from '../../utils/groupName'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const getStudentHistory = async (studentId: string) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Unauthorized')

  const student = await Prisma.student.findUnique({
    where: { id: studentId },
    include: {
      enrollments: {
        include: {
          // 🛑 التعديل الأول: لازم نجيب grade هنا
          group: { select: { name: true, price: true, paymentType: true, grade: true } },
        },
        take: 1,
      },
      // 1. سجل الغياب
      attendances: {
        include: {
          session: { select: { id: true, sessionDate: true } },
        },
        orderBy: { session: { sessionDate: 'desc' } },
      },
      // 2. سجل الامتحانات
      examResults: {
        include: {
          exam: { select: { title: true, maxScore: true, date: true } },
        },
        orderBy: { exam: { date: 'desc' } },
      },
      // 3. سجل المدفوعات
      payments: {
        select: {
          id: true,
          sessionId: true,
          amount: true,
          date: true,
          type: true,
          monthKey: true,
          session: {
            select: { sessionDate: true },
          },
        },
        orderBy: { date: 'desc' },
      },
    },
  })

  if (!student || student.teacherId !== teacher.id) {
    throw new Error('الطالب غير موجود')
  }

  const activeEnrollment = student.enrollments[0]
  const groupInfo = activeEnrollment?.group

  // 🛑 التعديل الثاني: حساب الاسم المدمج
  const fullGroupName = groupInfo
    ? groupInfo.name
      ? getFullGroupName({ grade: groupInfo.grade, name: groupInfo.name })
      : groupInfo.grade
    : 'بدون مجموعة'

  // الإحصائيات
  const total = student.attendances.length
  const present = student.attendances.filter((a) => a.status === 'PRESENT').length
  const absent = student.attendances.filter((a) => a.status === 'ABSENT').length

  return {
    info: {
      id: student.id,
      studentCode: student.studentCode,
      name: student.name,
      phone: student.parentPhone,
      groupName: fullGroupName, // <-- استخدام الاسم المدمج
      price: groupInfo?.price || 0,
      paymentType: groupInfo?.paymentType || 'PER_SESSION',
    },
    stats: {
      total,
      present,
      absent,
      attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0,
    },

    // سجل الغياب + حالة الدفع
    attendanceHistory: student.attendances.map((record) => {
      const payment = student.payments.find((p) => p.sessionId === record.session.id)

      return {
        id: record.id,
        date: record.session.sessionDate,
        status: record.status,
        note: record.note,
        hasPaid: !!payment,
        paymentAmount: payment?.amount || 0,
      }
    }),

    examsHistory: student.examResults.map((result) => ({
      id: result.id,
      title: result.exam.title,
      date: result.exam.date,
      score: result.score,
      maxScore: result.exam.maxScore,
    })),

    // سجل المدفوعات
    paymentsHistory: student.payments.map((p) => ({
      id: p.id,
      amount: p.amount,
      date: p.date,
      type: p.type,
      details:
        p.type === 'PER_SESSION' && p.session
          ? `حصة ${new Date(p.session.sessionDate).toLocaleDateString('ar-EG')}`
          : p.monthKey || 'مدفوعات عامة',
    })),
  }
}
