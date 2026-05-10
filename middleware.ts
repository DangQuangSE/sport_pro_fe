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
