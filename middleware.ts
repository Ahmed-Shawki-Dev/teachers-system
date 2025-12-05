import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET!

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const { pathname } = req.nextUrl

  let isAuthed = false
  // متغير عشان لو التوكين بايظ نمسحه ونرجع ريسبونس بالحذف
  let responseForInvalidToken: NextResponse | null = null

  // 1. التحقق من التوكين
  if (token) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET)
      await jwtVerify(token, secret)
      isAuthed = true
    } catch (error) {
      isAuthed = false
      // لو التوكين موجود بس مضروب، جهز ريسبونس يمسحه ويودي على اللوجين
      responseForInvalidToken = NextResponse.redirect(new URL('/login', req.url))
      responseForInvalidToken.cookies.delete({ name: 'token', path: '/' })
    }
  }

  // 2. التعامل مع المستخدم المسجل (Logged In)
  if (isAuthed) {
    // لو هو مسجل، وحاول يدخل "الهوم" أو "اللوجين"، نوديه الداشبورد علطول
    // ده الشرط اللي انت طالبه بالظبط
    if (pathname === '/' || pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    // لو رايح أي صفحة تانية مسموح بيها (زي البروفايل أو الداشبورد)، خليه يعدي
    return NextResponse.next()
  }

  // 3. التعامل مع المستخدم غير المسجل (Guest)
  if (!isAuthed) {
    // لو هو مش مسجل، وعايز يروح "الهوم" (اللانيدج) أو "اللوجين"، سيبه يعدي
    if (pathname === '/' || pathname === '/login') {
      // لو كان معاه توكين بايظ، رجع الريسبونس اللي بيمسحه، غير كدة كمل عادي
      return responseForInvalidToken ?? NextResponse.next()
    }

    // لو بيحاول يروح أي صفحة تانية محمية (زي الداشبورد)، اطرده على اللوجين
    return responseForInvalidToken ?? NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

// الـ Matcher مهم جداً عشان يغطي الهوم والصفحات المحمية
export const config = {
  matcher: [
    '/', // الهوم (اللانيدج)
    '/login', // صفحة الدخول
    '/logout',
    '/profile/:path*', // الصفحات المحمية
    '/dashboard/:path*', // الصفحات المحمية
  ],
}
