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

  if (pathname.startsWith('/ibackend')) {
    if (pathname.startsWith('/ibackendlogin')) {
      return NextResponse.next();
    }
    
    if (!request.cookies.has('admin_session')) {
      return NextResponse.redirect(new URL('/ibackendlogin', request.url));
    }

    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', 'Thu, 01 Jan 1970 00:00:00 GMT');
    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  // 显式排除 .ttf 结尾的文件
  matcher: ['/((?!api|_next|_vercel|favicon\\.svg|.*\\.ttf$|.*\\..*).*)']
};
