// actions/Student/addStudent.ts
'use server'
import { Prisma } from '../../lib/prisma'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { IStudent } from '../../validation/studentSchema'

const JWT_SECRET = process.env.JWT_SECRET!

export const addStudentAction = async (data: IStudent) => {
  const token = (await cookies()).get('token')?.value
  if (!token) throw new Error('Not authenticated')

  const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
  const teacherId = payload.userId as string
  if (!teacherId) throw new Error('Invalid token')

  return await Prisma.student.create({
    data: {
      ...data,
      teacherId,
    },
  })
}
