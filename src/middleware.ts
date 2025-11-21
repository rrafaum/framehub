import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('framehub_token')?.value;

  const signInURL = new URL('/login', request.url);
  const dashboardURL = new URL('/', request.url);

  const { pathname } = request.nextUrl;

  if (!token) {
    if (pathname !== '/login' && pathname !== '/register') {
      return NextResponse.redirect(signInURL);
    }
  }

  if (token) {
    if (pathname === '/login' || pathname === '/register') {
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