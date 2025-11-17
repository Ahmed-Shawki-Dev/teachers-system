import bcrypt from 'bcrypt'
import { SignJWT } from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '../../../lib/prisma'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  const user = await Prisma.teacher.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 401 })

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return NextResponse.json({ error: 'الباسورد غلط' }, { status: 401 })

  const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
  const token = await new SignJWT({ userId: user.id, email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('72h')
    .sign(secret)

  const response = NextResponse.json({ message: 'أهلا يا أستاذ❤️' })

  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 72 * 3600,
    path: '/',
  })

  return response
}
