'use server'
import { Prisma } from '@/lib/prisma'

export const getLandingStats = async () => {
  const [teachers, students, groups] = await Promise.all([
    Prisma.teacher.count(),
    Prisma.student.count(),
    Prisma.group.count(),
  ])

  return {
    teachers,
    students,
    groups,
  }
}
