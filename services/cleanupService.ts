import { Prisma } from '@/lib/prisma'

// 1. خدمة تصفير الأحداث (حصص - امتحانات - ماليات)
export async function resetEventsService(teacherId: string) {
  // بنستخدم Transaction عشان نضمن ان كله يتمسح أو مفيش حاجة تتمسح
  return await Prisma.$transaction([
    // مسح الامتحانات
    Prisma.exam.deleteMany({
      where: { group: { teacherId } },
    }),
    // مسح الحصص (شاملة الغياب والحضور)
    Prisma.session.deleteMany({
      where: { group: { teacherId } },
    }),
    // مسح المدفوعات
    Prisma.payment.deleteMany({
      where: { group: { teacherId } },
    }),
  ])
}

// 2. خدمة حذف جميع الطلاب
export async function deleteAllStudentsService(teacherId: string) {
  // التصحيح: مسح الطلاب التابعين للمدرس مباشرةً بغض النظر عن المجموعات
  return await Prisma.student.deleteMany({
    where: {
      teacherId: teacherId, // كده هيمسح أي طالب مسجل تحت هذا المدرس
    },
  })
}

// 3. خدمة حذف جميع المجموعات
export async function deleteAllGroupsService(teacherId: string) {
  // مسح المجموعات (وده بيمسح كل حاجة تابعة ليها لو الـ Cascade شغال في الداتابيز)
  return await Prisma.group.deleteMany({
    where: { teacherId },
  })
}
