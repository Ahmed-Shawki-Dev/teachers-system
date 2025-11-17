import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET!

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const { pathname } = req.nextUrl

  let isAuthed = false
  let responseForInvalidToken: NextResponse | null = null

  if (token) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET)
      await jwtVerify(token, secret)
      isAuthed = true
    } catch (error) {
      console.error('Middleware Verification Error:', error)
      isAuthed = false
      responseForInvalidToken = NextResponse.redirect(new URL('/login', req.url))
      responseForInvalidToken.cookies.delete({ name: 'token', path: '/' })
    }
  }

  if (pathname === '/login') {
    if (isAuthed) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return responseForInvalidToken ?? NextResponse.next()
  }

  if (!isAuthed) {
    return responseForInvalidToken ?? NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/teacher-profile/:path*', '/dashboard/:path*', '/login','/logout'],
}
