'use server'

import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'
import { revalidatePath } from 'next/cache'
import {
  resetEventsService,
  deleteAllStudentsService,
  deleteAllGroupsService,
} from '@/services/cleanupService'

// 1. تصفير الأحداث
export async function resetEventsAction() {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) return { success: false, message: 'غير مصرح لك' }

  try {
    await resetEventsService(teacher.id) // بعتنا ID المدرس
    revalidatePath('/dashboard')
    return { success: true, message: 'تم تصفير جميع الأحداث والماليات بنجاح' }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'حدث خطأ أثناء التصفير' }
  }
}

// 2. حذف الطلاب
export async function deleteAllStudentsAction() {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) return { success: false, message: 'غير مصرح لك' }

  try {
    await deleteAllStudentsService(teacher.id)
    revalidatePath('/dashboard')
    return { success: true, message: 'تم حذف جميع الطلاب بنجاح' }
  } catch (error) {
    return { success: false, message: 'فشل حذف الطلاب' }
  }
}

// 3. حذف المجموعات
export async function deleteAllGroupsAction() {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) return { success: false, message: 'غير مصرح لك' }

  try {
    await deleteAllGroupsService(teacher.id)
    revalidatePath('/dashboard')
    return { success: true, message: 'تم حذف جميع المجموعات بنجاح' }
  } catch (error) {
    return { success: false, message: 'فشل حذف المجموعات' }
  }
}
