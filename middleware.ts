import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

let locales = ['en', 'vi']
let defaultLocale = 'en'

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage && acceptLanguage.includes('vi')) {
    return 'vi'
  }
  return 'en'
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // --- Route Protection Logic ---
  const isLoggedIn = request.cookies.get('is_logged_in')?.value === 'true'
  const userRole = request.cookies.get('user_role')?.value
  const isAuthRoute = pathname.includes('/login') || pathname.includes('/register')
  
  // Note: Add protected routes here as the app grows, e.g., '/profile', '/checkout'
  const protectedRoutes = ['/profile', '/orders', '/admin']
  const isProtectedRoute = protectedRoutes.some(route => pathname.includes(route))

  if (isProtectedRoute && !isLoggedIn) {
    const locale = getLocale(request)
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  // Admin route role protection
  if (pathname.includes('/admin') && userRole !== 'ADMIN') {
    const locale = getLocale(request)
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }

  if (isAuthRoute && isLoggedIn) {
    const locale = getLocale(request)
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }
  // ------------------------------

  if (pathnameHasLocale) return

  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|api|images|.*\\.).*)',
  ],
}
