import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['zh', 'en'],
  defaultLocale: 'zh',
  localePrefix: 'as-needed'
});

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log('🚀 [中间件雷达] 捕捉路径:', pathname);

  if (pathname.startsWith('/ibackend') || pathname.startsWith('/ibackendlogin')) {

    if (pathname.startsWith('/ibackend') && !pathname.startsWith('/ibackendlogin')) {
      if (!request.cookies.has('admin_session')) {
        console.log('❌ 权限不足，重定向至登录页');
        return NextResponse.redirect(new URL('/ibackendlogin', request.url));
      }
    }

    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};