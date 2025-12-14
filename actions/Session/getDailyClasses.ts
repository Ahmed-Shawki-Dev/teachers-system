'use server'
import { Prisma } from '@/lib/prisma'
import { DayOfWeek } from '@prisma/client'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken' // 1. لازم نستدعي بيانات المدرس

function getDayName(date: Date): DayOfWeek {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  return days[date.getDay()] as DayOfWeek
}

export const getDailyClasses = async (dateString: string) => {
  // 2. أمان: هات المدرس الحالي
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('غير مصرح لك')

  const selectedDate = new Date(dateString)
  const dayName = getDayName(selectedDate)

  const startOfDay = new Date(selectedDate)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(selectedDate)
  endOfDay.setHours(23, 59, 59, 999)

  // 3. التعديل الأول: هات "مجموعات المدرس ده بس" اللي عندها جدول النهاردة
  const scheduledGroups = await Prisma.group.findMany({
    where: {
      teacherId: teacher.id, // <--- السطر ده هو اللي بيحمي الداتا
      schedule: {
        some: { dayOfWeek: dayName },
      },
    },
    include: {
      schedule: true,
      _count: { select: { enrollments: true } },
    },
  })

  // 4. التعديل التاني: هات "حصص المدرس ده بس" المتسجلة النهاردة
  const recordedSessions = await Prisma.session.findMany({
    where: {
      sessionDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
      // بنفلتر الحصص اللي تابعة لمجموعة تابعة للمدرس ده
      group: {
        teacherId: teacher.id, // <--- وده كمان حماية مزدوجة
      },
    },
  })

  // 5. الخلاط (تعديل: دمج اسم الجروب)
  const dailyClasses = scheduledGroups.flatMap((group) => {
    const todaysSchedules = group.schedule.filter((s) => s.dayOfWeek === dayName)

    // 🛑 بناء الاسم المدمج
    const fullGroupName = group.name ? `${group.grade} - ${group.name}` : group.grade

    return todaysSchedules.map((scheduleItem) => {
      // بما إننا فلترنا فوق، السيشن اللي هتيجي أكيد بتاعة المدرس ده
      const realSession = recordedSessions.find((s) => s.groupId === group.id)

      return {
        groupId: group.id,
        groupName: fullGroupName, // <-- استخدام الاسم المدمج
        studentCount: group._count.enrollments,
        startTime: scheduleItem.startTime,
        endTime: scheduleItem.endTime,

        isCreated: !!realSession,
        sessionId: realSession?.id || null,
        status: realSession?.status || 'SCHEDULED',
      }
    })
  })

  return dailyClasses.sort((a, b) => a.startTime.localeCompare(b.startTime))
}

export type SessionCardData = Awaited<ReturnType<typeof getDailyClasses>>[number]
