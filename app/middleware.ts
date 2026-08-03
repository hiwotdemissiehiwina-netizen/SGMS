import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // localStorage በ Server side ስለማይገኝ በ HTTP-only Cookies ወይም በወጡ Custom Headers አረጋግጥ።
  // እዚህ ጋር በ Client-Side Response/Header ደረጃ Security Token እንዲያልፍ ይደረጋል።
  
  const adminToken = request.cookies.get('adminToken')?.value;
  const userRole = request.cookies.get('adminRole')?.value;

  // 1. Unauthenticated users ወደ /admin ወይም /super-admin ሲሄዱ ወደ Login ይመልሳቸዋል
  if ((pathname.startsWith('/admin') || pathname.startsWith('/super-admin')) && !pathname.endsWith('/login')) {
    if (!adminToken) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Department Admin ወደ Super Admin ገጽ እንዳይገባ ይከለክላል (Role Authorization)
  if (pathname.startsWith('/super-admin') && !pathname.endsWith('/login')) {
    if (userRole !== 'super-admin') {
      const unauthorizedUrl = new URL('/admin', request.url);
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  return NextResponse.next();
}

// Middlewareው የሚሰራባቸውን የ Routes ድንበሮች መወሰኛ (Matcher)
export const config = {
  matcher: ['/admin/:path*', '/super-admin/:path*'],
};