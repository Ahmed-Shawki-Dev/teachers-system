'use server'

import { Prisma } from '@/lib/prisma'
import { Prisma as PrismaClient } from '@prisma/client' 
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'
import { getFullGroupName } from '@/utils/groupName'

// 👇 1. ضفنا الباراميتر هنا
export const getUnpaidSessions = async (groupId: string, includeArchived: boolean = false) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('Unauthorized')

  const group = await Prisma.group.findUnique({
    where: { id: groupId },
    select: { name: true, price: true, teacherId: true, grade: true },
  })

  if (!group || group.teacherId !== teacher.id) throw new Error('Unauthorized')

  // 👇 2. شرط الأرشفة
  const studentWhereClause: PrismaClient.StudentWhereInput = {
    enrollments: { some: { groupId } },
  }

  // لو مش عايز الأرشيف، ضيف الشرط ده. لو عايزه، سيبها مفتوحة
  if (!includeArchived) {
    studentWhereClause.isArchived = false
  }

  const students = await Prisma.student.findMany({
    where: studentWhereClause, // 👈 طبقنا الشرط
    select: {
      id: true,
      name: true,
      studentCode: true,
      parentPhone: true,
      // 👇 ضيفنا ده عشان نعرف الطالب مأرشف ولا لأ لو حبيت تستخدمه
      isArchived: true,
      attendances: {
        where: {
          status: 'PRESENT',
          session: {
            group: {
              teacherId: teacher.id,
              paymentType: 'PER_SESSION',
            },
          },
        },
        include: {
          session: {
            include: {
              group: { select: { price: true, name: true, grade: true } },
            },
          },
        },
      },
      payments: {
        where: {
          type: 'PER_SESSION',
          group: { teacherId: teacher.id },
        },
      },
    },
  })

  const debtList = students
    .map((student) => {
      const allAttendedSessions = student.attendances
      const paidSessionIds = student.payments.filter((p) => p.sessionId).map((p) => p.sessionId)
      const unpaidSessions = allAttendedSessions.filter(
        (attendance) => !paidSessionIds.includes(attendance.session.id),
      )

      const totalDebt = unpaidSessions.reduce((sum, record) => {
        return sum + (record.session.group.price || 0)
      }, 0)

      return {
        studentId: student.id,
        name: student.name,
        studentCode: student.studentCode,
        phone: student.parentPhone,
        isArchived: student.isArchived, // 👈 رجعنا المعلومة دي
        unpaidCount: unpaidSessions.length,
        totalDebt: totalDebt,
        details: unpaidSessions.map((a) => ({
          date: a.session.sessionDate,
          groupName: getFullGroupName(a.session.group),
          price: a.session.group.price,
        })),
        unpaidDates: unpaidSessions.map((a) => a.session.sessionDate),
      }
    })
    .filter((s) => s.unpaidCount > 0)

  return { debtList, groupName: getFullGroupName(group), price: group.price }
}
