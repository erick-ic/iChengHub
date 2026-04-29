import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  defaultLocale: 'zh',
  locales: ['en', 'zh'],
  localePrefix: 'always'
});

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};