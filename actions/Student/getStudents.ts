// actions/Student/getStudents.ts
'use server'
import { Prisma as PrismaClient } from '@prisma/client'
import { Prisma } from '../../lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const getAllStudentsAction = async (
  searchTerm?: string,
  groupId?: string,
  grade?: string,
) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw new Error('غير مسجل الدخول')

  const whereClause: PrismaClient.StudentWhereInput = {
    teacherId: teacher.id,
  }

  if (searchTerm) {
    // 🛑 التعديل المطلوب: البحث بالاسم أو بالكود (OR condition)
    whereClause.OR = [
      { name: { contains: searchTerm, mode: 'insensitive' } }, // البحث بالاسم
      { studentCode: { contains: searchTerm, mode: 'insensitive' } }, // البحث بالكود
    ]
  }

  // ... (باقي كود الـ whereClause لـ groupId و grade)
  if ((groupId && groupId !== 'all') || (grade && grade !== 'all')) {
    whereClause.enrollments = {
      some: {
        groupId: groupId && groupId !== 'all' ? groupId : undefined,
        // 🚨 ملاحظة: لو كنت هتضيف academicGrade، لازم تستخدمه هنا بدل name!
        group: grade && grade !== 'all' ? { name: { contains: grade } } : undefined,
      },
    }
  }

  // 🚨 التعديل الثاني: لازم نجيب studentCode في الـ select عشان نعرضه
 return await Prisma.student.findMany({
    where: whereClause,
    
    // 👇 نستخدم SELECT فقط، ونضع بداخله كل الحقول المطلوبة (بما فيها العلاقات)
    select: { 
        id: true,
        name: true,
        parentPhone: true,
        teacherId: true,
        studentCode: true, // ✅ هنا الكود بتاع الطالب
        createdAt: true,
        updatedAt: true,
        
        // 🤝 تم نقل الـ include القديم داخل الـ select الجديد
        enrollments: {
            include: {
                group: { select: { name: true } }, 
            },
            take: 1,
            orderBy: { id: 'desc' },
        },
    },
    orderBy: { id: 'desc' },
  })
}

