import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('framehub_token')?.value;
  const refreshToken = request.cookies.get('framehub_refresh_token')?.value;

  const signInURL = new URL('/login', request.url);
  const dashboardURL = new URL('/', request.url);
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname === '/login' || pathname === '/register';

  if (!accessToken && !refreshToken) {
    if (!isAuthRoute) {
      return NextResponse.redirect(signInURL);
    }
  }

  if (accessToken || refreshToken) {
    if (isAuthRoute) {
      return NextResponse.redirect(dashboardURL);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$).*)',
  ],
}