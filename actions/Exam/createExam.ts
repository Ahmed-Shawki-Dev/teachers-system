'use server'
import { revalidatePath } from 'next/cache'
import { Prisma } from '../../lib/prisma'
import { IExam } from '../../validation/examSchema'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const createExamAction = async (data: IExam) => {
  try {
    const { groupId, date, maxScore, title } = data
    const teacher = await getTeacherByTokenAction()
    if (!teacher) throw new Error('غير مصرح لك')

    const group = await Prisma.group.findUnique({
      where: { id: groupId },
    })

    if (!group || group.teacherId !== teacher.id) {
      return { success: false, message: 'هذه المجموعة لا تتبع لك' }
    }

    await Prisma.exam.create({
      data: {
        title,
        date,
        maxScore,
        groupId,
      },
    })

    revalidatePath('/dashboard/exams')
    revalidatePath(`/dashboard/groups/${data.groupId}`)

    return { success: true, message: 'تم إضافة الامتحان بنجاح 📝' }
    
  } catch (error) {
    console.error('Add Exam Error:', error)
    return { success: false, message: 'حدث خطأ أثناء إضافة الامتحان' }
  }
}
