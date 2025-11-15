'use server'
import { Prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { revalidatePath } from 'next/cache'
import { ITeacher } from '../../validation/teacherSchema'

interface ITeacherDB extends ITeacher {
  avatarUrl: string
}

export const addTeacherAction = async (teacher: ITeacherDB) => {
  const { email, name, password, avatarUrl } = teacher
  const hashedPassword = await bcrypt.hash(password, 10)
  await Prisma.teacher.create({
    data: {
      email,
      name,
      password: hashedPassword,
      avatarUrl,
    },
  })
  revalidatePath('/add-todo')
}
