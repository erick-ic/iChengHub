import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

// 定义路由配置
const routing = defineRouting({
  locales: ['en', 'zh'],
  defaultLocale: 'zh',
  localePrefix: 'always'
});

// 创建导航 API
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);