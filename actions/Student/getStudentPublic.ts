'use server'
import { Prisma } from '@/lib/prisma'
import { unstable_noStore as noStore } from 'next/cache'

export const getStudentPublicAction = async (studentCode: string) => {
  noStore() // داتا فريش لولي الأمر

  // 1. بحث بالكود (بدون Teacher check)
  const student = await Prisma.student.findUnique({
    where: { studentCode: studentCode }, // 👈 البحث بالكود
    include: {
      enrollments: {
        include: {
          // 🛑 التعديل: لازم نجيب grade هنا
          group: { select: { name: true, price: true, paymentType: true, grade: true } },
        },
        take: 1,
      },
      // ... نفس الـ Includes بتاعتك بالظبط
      attendances: {
        include: {
          session: { select: { id: true, sessionDate: true } },
        },
        orderBy: { session: { sessionDate: 'desc' } },
      },
      examResults: {
        include: {
          exam: { select: { title: true, maxScore: true, date: true } },
        },
        orderBy: { exam: { date: 'desc' } },
      },
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

  if (!student) {
    return null // لو الكود غلط
  }

  const activeEnrollment = student.enrollments[0]
  const groupInfo = activeEnrollment?.group

  // 🛑 التعديل: حساب الاسم المدمج
  const fullGroupName = groupInfo
    ? groupInfo.name
      ? `${groupInfo.grade} - ${groupInfo.name}`
      : groupInfo.grade
    : 'بدون مجموعة'

  // الإحصائيات
  const total = student.attendances.length
  const present = student.attendances.filter((a) => a.status === 'PRESENT').length
  const absent = student.attendances.filter((a) => a.status === 'ABSENT').length

  // 👇 إرجاع نفس الهيكل بالظبط عشان الكومبوننتس تشتغل
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
