'use server'
import { Prisma } from '../../lib/prisma'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET!

export const getAllStudentsAction = async () => {
  const cookieStore = cookies()
  const token = (await cookieStore).get('token')?.value
  if (!token) throw new Error('Not authenticated')

  const secret = new TextEncoder().encode(JWT_SECRET)
  const { payload } = await jwtVerify(token, secret)
  const teacherId = payload.userId as string
  if (!teacherId) throw new Error('Invalid token')

  return await Prisma.student.findMany({
    where: { teacherId },
    orderBy: { createdAt: 'desc' },
  })
}
