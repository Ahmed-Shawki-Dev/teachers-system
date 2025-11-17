'use server'
import { Prisma } from '../../lib/prisma'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET!

export const getTeacherByTokenAction = async () => {
  const cookieStore = await cookies() 
  const token = cookieStore.get('token')?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    const userId = payload.userId as string

    const teacher = await Prisma.teacher.findUnique({
      where: { id: userId },
    })
    return teacher
  } catch {
    return null
  }
}
