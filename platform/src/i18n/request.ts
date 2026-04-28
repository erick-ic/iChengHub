import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async ({ requestLocale }) => {
  // 检查请求路径，如果是 favicon.ico 则跳过
  const headersList = await headers();
  const pathname = headersList.get('x-nextjs-pathname') || '';
  
  if (pathname.includes('.ico') || pathname.includes('.json')) {
    return {
      locale: 'zh',
      messages: {}
    };
  }
  
  let locale = await requestLocale;
  
  if (!locale) {
    locale = 'zh';
  }
  
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});