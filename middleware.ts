import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET!

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const { pathname } = req.nextUrl

  let isAuthed = false
  let responseForInvalidToken: NextResponse | null = null

  // 1. التحقق من التوكين
  if (token) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET)
      await jwtVerify(token, secret)
      isAuthed = true
    } catch (error) {
      isAuthed = false
      responseForInvalidToken = NextResponse.redirect(new URL('/login', req.url))
      responseForInvalidToken.cookies.delete({ name: 'token', path: '/' })
    }
  }

  // تحديد الصفحات العامة (المسموح بيها للكل)
  // 🛑 التعديل هنا: ضفنا student عشان ولي الأمر يدخل براحته
  const isPublicPage = pathname === '/' || pathname === '/login' || pathname.startsWith('/student')

  // 2. التعامل مع المستخدم المسجل (Logged In)
  if (isAuthed) {
    // لو مسجل وحاول يروح الهوم أو اللوجين -> وديه الداشبورد
    if (pathname === '/' || pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    // ملاحظة: لو هو مدرس ودخل على /student، هنسيبه يعدي عادي يشوفها
    return NextResponse.next()
  }

  // 3. التعامل مع المستخدم غير المسجل (Guest)
  if (!isAuthed) {
    // 🛑 التعديل هنا: لو رايح صفحة عامة (بما فيها student) سيبه يعدي
    if (isPublicPage) {
      return responseForInvalidToken ?? NextResponse.next()
    }

    // أي حاجة تانية (داشبورد، بروفايل) -> على اللوجين
    return responseForInvalidToken ?? NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/logout',
    '/profile/:path*',
    '/dashboard/:path*',
    '/student/:path*',
    '/print/:path*',
  ],
}
