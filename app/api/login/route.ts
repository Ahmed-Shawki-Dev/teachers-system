import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '../../../lib/prisma'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  const user = await Prisma.teacher.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 401 })

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return NextResponse.json({ error: 'الباسورد غلط' }, { status: 401 })

  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: '72h',
  })

  const response = NextResponse.json({ message: 'أهلا يا أستاذ❤️' })

  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 72 * 3600,
    path: '/',
  })

  return response
}
