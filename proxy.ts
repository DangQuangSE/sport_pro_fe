import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SUPPORTED_LOCALES } from "./src/lib/seo/policy";

const PROTECTED_ROUTES = ["/profile", "/orders", "/admin"];

function pathnameLocale(pathname: string): (typeof SUPPORTED_LOCALES)[number] | null {
  return SUPPORTED_LOCALES.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  ) ?? null;
}

function redirect(request: NextRequest, pathname: string, permanent = false) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url, permanent ? 308 : 307);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = pathnameLocale(pathname);
  const requestedLocale = locale ?? "vi";
  const localePath = locale ? pathname.slice(locale.length + 1) || "/" : pathname;

  const isLoggedIn = request.cookies.get("is_logged_in")?.value === "true";
  const userRole = request.cookies.get("user_role")?.value;
  const isAuthRoute = localePath === "/login" || localePath === "/register";
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => localePath === route || localePath.startsWith(`${route}/`),
  );

  if (isProtectedRoute && !isLoggedIn) {
    return redirect(request, `/${requestedLocale}/login`);
  }

  if ((localePath === "/admin" || localePath.startsWith("/admin/")) && userRole !== "ADMIN") {
    return redirect(request, `/${requestedLocale}`);
  }

  if (isAuthRoute && isLoggedIn) {
    return redirect(request, `/${requestedLocale}`);
  }

  if (locale) return undefined;

  return redirect(request, `/vi${pathname === "/" ? "" : pathname}`, true);
}

export const config = {
  matcher: [
    "/((?!_next|favicon\\.ico|robots\\.txt|sitemap\\.xml|api|images|.*\\.).*)",
  ],
};
