import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation'; // 引入 404 触发器

// 定义系统绝对支持的语言白名单
const locales = ['zh', 'en']; 

export default getRequestConfig(async ({ requestLocale }) => {
  // 保留你的原始请求拦截逻辑
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
  
  // 🛡️ 核心防御：白名单拦截
  // 如果提取出来的 locale 不在我们的数组里 (比如 'ibackup')，直接斩断，抛出 404
  if (!locales.includes(locale)) {
    notFound();
  }
  
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});