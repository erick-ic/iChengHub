import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'zh',
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;


  if (pathname.startsWith('/ibackend') || pathname.startsWith('/ibackendlogin')) {
    if (pathname === '/ibackend' && !pathname.startsWith('/ibackendlogin')) {
      if (!request.cookies.has('admin_session')) {
        return NextResponse.redirect(new URL('/ibackendlogin', request.url));
      }
    }
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
