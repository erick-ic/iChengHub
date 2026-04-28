import createMiddleware from 'next-intl/middleware';
import { locales, localePrefix } from './src/navigation';

export default createMiddleware({
  defaultLocale: 'zh',
  locales,
  localePrefix
});

export const config = {
  matcher: ['/']
};