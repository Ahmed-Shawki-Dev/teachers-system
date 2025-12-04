'use server'
import { Prisma } from '@/lib/prisma'
import { DayOfWeek } from '@prisma/client'

// دالة عشان نعرف اليوم ده إيه (SUNDAY, MONDAY...)
function getDayName(date: Date): DayOfWeek {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  return days[date.getDay()] as DayOfWeek
}

export const getDailyClasses = async (dateString: string) => {
  const selectedDate = new Date(dateString)
  const dayName = getDayName(selectedDate)

  // 1. حدود اليوم (من 00:00 لـ 23:59)
  const startOfDay = new Date(selectedDate)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(selectedDate)
  endOfDay.setHours(23, 59, 59, 999)

  // 2. هات "الخطة": المجموعات اللي عندها حصص في اليوم ده
  const scheduledGroups = await Prisma.group.findMany({
    where: {
      schedule: {
        some: { dayOfWeek: dayName },
      },
    },
    include: {
      schedule: true,
      _count: { select: { enrollments: true } },
    },
  })

  // 3. هات "الواقع": الحصص اللي اتسجلت فعلاً النهاردة
  const recordedSessions = await Prisma.session.findMany({
    where: {
      sessionDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  })

  // 4. الخلاط: ادمج الاتنين
  const dailyClasses = scheduledGroups.flatMap((group) => {
    // هات كل المواعيد اللي بتوافق اليوم ده (عشان لو المجموعة ليها حصتين)
    const todaysSchedules = group.schedule.filter((s) => s.dayOfWeek === dayName)

    return todaysSchedules.map((scheduleItem) => {
      // دور هل فيه سيشن مسجل للجروب ده؟
      // (بما إننا شيلنا الوقت من السيشن، هنعتمد على الجروب والتاريخ بس)
      // *ملحوظة: لو فيه حصتين لنفس الجروب، الاتنين هيربطوا بنفس السيشن في الوضع الحالي*
      const realSession = recordedSessions.find((s) => s.groupId === group.id)

      return {
        groupId: group.id,
        groupName: group.name,
        studentCount: group._count.enrollments,
        startTime: scheduleItem.startTime,
        endTime: scheduleItem.endTime,

        // الحالة
        isCreated: !!realSession,
        sessionId: realSession?.id || null,
        status: realSession?.status || 'SCHEDULED',
      }
    })
  })

  // ترتيب حسب وقت البداية
  return dailyClasses.sort((a, b) => a.startTime.localeCompare(b.startTime))
}

// تصدير النوع عشان نستخدمه في الـ UI
export type SessionCardData = Awaited<ReturnType<typeof getDailyClasses>>[number]
