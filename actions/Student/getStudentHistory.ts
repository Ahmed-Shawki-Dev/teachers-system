'use server'
import { Prisma } from '@/lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const getStudentHistory = async (studentId: string) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Unauthorized')

  const student = await Prisma.student.findUnique({
    where: { id: studentId },
    include: {
      enrollments: {
        include: {
          group: { select: { name: true, price: true, paymentType: true } },
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
      // 3. سجل المدفوعات (التعديل هنا 👇)
      payments: {
        select: {
          id: true, // 👈 ضفنا الـ ID
          sessionId: true,
          amount: true,
          date: true,
          type: true,
          monthKey: true,
          session: {
            // 👈 ضفنا العلاقة عشان نعرف نجيب التاريخ تحت
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
      groupName: groupInfo?.name || 'بدون مجموعة',
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
      // دلوقتي payments فيها sessionId لأننا اخترناه فوق
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
      id: p.id, // دلوقتي بقت موجودة ومش هتضرب إيرور
      amount: p.amount,
      date: p.date,
      type: p.type,
      details:
        p.type === 'PER_SESSION' && p.session // و p.session بقت موجودة
          ? `حصة ${new Date(p.session.sessionDate).toLocaleDateString('ar-EG')}`
          : p.monthKey || 'مدفوعات عامة',
    })),
  }
}
