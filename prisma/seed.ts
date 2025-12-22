import { fakerAR } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 🛑 بيانات ثابتة لازم تكون موجودة في الداتابيز عندك
const TEACHER_ID = '69433cca0d54014a0e58dd8e'
const GROUP_ID = '694871c0b73f3e84bea57c77' // 👈 هات ID جروب حقيقي وحطه هنا
const FIXED_PHONE = '01098786468'

async function main() {
  console.log('🌱 Starting seed with enrollment...')

  const studentsData = []
  const usedCodes = new Set()

  // 1. تجهيز بيانات 1000 طالب
  for (let i = 0; i < 10000; i++) {
    let studentCode
    do {
      studentCode = Math.floor(100000 + Math.random() * 900000).toString()
    } while (usedCodes.has(studentCode))
    usedCodes.add(studentCode)

    studentsData.push({
      name: `${fakerAR.person.fullName()} (${i})`,
      studentCode: studentCode,
      parentPhone: FIXED_PHONE,
      teacherId: TEACHER_ID,
    })
  }

  console.log(`⏳ 1. Creating ${studentsData.length} students...`)

  // 2. إدخال الطلاب للداتابيز
  await prisma.student.createMany({
    data: studentsData,
  })

  // 3. نجيب الـ IDs بتوع الطلاب اللي لسه عاملينهم عشان نسجلهم في الجروب
  // (هنجيبهم بدلالة المدرس ورقم التليفون الثابت عشان نضمن اننا بنجيب بتوع الـ seed بس)
  const createdStudents = await prisma.student.findMany({
    where: {
      teacherId: TEACHER_ID,
      parentPhone: FIXED_PHONE,
    },
    select: { id: true },
  })

  console.log(`⏳ 2. Enrolling students to Group (${GROUP_ID})...`)

  // 4. تجهيز بيانات الـ Enrollment
  const enrollmentsData = createdStudents.map((student) => ({
    studentId: student.id,
    groupId: GROUP_ID,
  }))

  // 5. إدخال التسجيلات مرة واحدة
  await prisma.enrollment.createMany({
    data: enrollmentsData,
  })

  console.log('✅ Done! Students created and enrolled successfully.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
