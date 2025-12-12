'use server'

import { Prisma } from '@/lib/prisma'
import { AttendanceStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

type AttendanceInput = {
  studentId: string
  status: AttendanceStatus
  note?: string
  hasPaid?: boolean
}

export const upsertAttendanceAction = async (
  sessionId: string,
  attendanceData: AttendanceInput[],
  groupPrice: number,
  isPerSession: boolean,
) => {
  try {
    const teacher = await getTeacherByTokenAction()
    if (!teacher) throw new Error('غير مصرح لك')

    const session = await Prisma.session.findUnique({
      where: { id: sessionId },
      include: { group: true },
    })

    if (!session || session.group.teacherId !== teacher.id) {
      throw new Error('لا يمكنك تعديل هذه الحصة')
    }

    // 🔥 الاستراتيجية النووية: Bulk Operations
    // بنمسح القديم كله ونحط الجديد (أسرع 100 مرة من التعديل طالب طالب)

    await Prisma.$transaction(
      async (tx) => {
        // 1. امسح سجل الحضور القديم لهذه الحصة بالكامل
        await tx.attendance.deleteMany({
          where: { sessionId: sessionId },
        })

        // 2. سجل الحضور الجديد كله مرة واحدة (Bulk Insert)
        if (attendanceData.length > 0) {
          await tx.attendance.createMany({
            data: attendanceData.map((record) => ({
              sessionId: sessionId,
              studentId: record.studentId,
              status: record.status,
              note: record.note,
            })),
          })
        }

        // 3. التعامل مع الفلوس (لو بالحصة)
        if (isPerSession) {
          // أ. امسح كل المدفوعات المرتبطة بالحصة دي (عشان نعيد حسابها صح)
          await tx.payment.deleteMany({
            where: { sessionId: sessionId },
          })

          // ب. فلتر الطلاب اللي دفعوا بس
          const paidStudents = attendanceData.filter((r) => r.hasPaid)

          // ج. سجل مدفوعاتهم مرة واحدة
          if (paidStudents.length > 0) {
            await tx.payment.createMany({
              data: paidStudents.map((record) => ({
                amount: groupPrice,
                type: 'PER_SESSION',
                date: new Date(),
                studentId: record.studentId,
                groupId: session.groupId,
                sessionId: sessionId,
              })),
            })
          }
        }

        // 4. قفل الحصة
        await tx.session.update({
          where: { id: sessionId },
          data: { status: 'COMPLETED' },
        })
      },
      {
        maxWait: 5000,
        timeout: 20000,
      },
    )

    revalidatePath(`/dashboard/sessions/${sessionId}`)
    revalidatePath('/dashboard/sessions')

    return { success: true, message: 'تم الحفظ بنجاح (Bulk Mode) 🚀' }
  } catch (error) {
    console.error('❌ Error in Bulk Action:', error)
    return { success: false, message: 'حدث خطأ، حاول تقليل العدد أو المحاولة لاحقاً' }
  }
}
