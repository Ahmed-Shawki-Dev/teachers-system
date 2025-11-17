import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ message: 'تم تسجيل الخروج' })

  res.cookies.set('token', '', { path: '/', maxAge: 0 })
  return res
}
