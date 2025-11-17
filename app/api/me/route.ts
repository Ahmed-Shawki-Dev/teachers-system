// app/api/me/route.ts
import { jwtVerify } from 'jose'
import { NextResponse } from 'next/server'
import { getTeacherByIdAction } from '../../../actions/Teacher/getTeacherById'

const JWT_SECRET = process.env.JWT_SECRET!

export async function GET(req: Request) {
  const cookie = req.headers.get('cookie')
  if (!cookie?.includes('token=')) return NextResponse.json({ auth: false })

  const token = cookie
    .split('; ')
    .find((c) => c.startsWith('token='))
    ?.split('=')[1]
  if (!token) return NextResponse.json({ auth: false })

  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    const userId = payload.userId as string

    const user = await getTeacherByIdAction(userId)

    if (!user) return NextResponse.json({ auth: false })

    return NextResponse.json({
      auth: true,
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl || null,
      bio: user.bio,
      phone: user.phone,
    })
  } catch {
    return NextResponse.json({ auth: false })
  }
}
