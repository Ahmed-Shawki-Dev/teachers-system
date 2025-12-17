'use server'

import { Prisma } from '@/lib/prisma' // تأكد من المسار
import { ITeacher, teacherSchema } from '@/validation/teacherSchema'
import { hash } from 'bcrypt'
import { revalidatePath } from 'next/cache'

export async function addTeacherAction(data: ITeacher) {
  // 1. ✅ بنعمل validation تاني ع السيرفر عشان الأمان
  const parsedData = teacherSchema.parse(data)

  // التأكد من عدم تكرار الإيميل
  const existingTeacher = await Prisma.teacher.findUnique({
    where: { email: parsedData.email },
  })

  if (existingTeacher) {
    throw new Error('هذا البريد الإلكتروني مسجل بالفعل')
  }

  const hashedPassword = await hash(parsedData.password, 12)

  // 2. ✅ هنا اللعبة كلها: لازم نباصي كل الحقول لـ Prisma
  const teacher = await Prisma.teacher.create({
    data: {
      name: parsedData.name,
      email: parsedData.email,
      password: hashedPassword,
      phone: parsedData.phone,
      bio: parsedData.bio,
      avatarUrl: parsedData.avatarUrl,

      // 👇 الحقول دي كانت منسية غالباً
      tier: parsedData.tier, // BASIC or PRO
      maxStudents: parsedData.maxStudents, // الرقم اللي جي من الفورم (200 أو 500)
      hasBarcodeScanner: parsedData.hasBarcodeScanner ?? false, // لو undefined خليه false
    },
  })

  revalidatePath('/dashboard/teachers') // أو المسار اللي بتعرض فيه المدرسين
  return teacher
}
