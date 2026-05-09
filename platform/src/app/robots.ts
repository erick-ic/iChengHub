import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/_next/',
        // 绝对不能在这里写出真实的后台地址
      ],
    },
    sitemap: 'https://ichenghub.cn/sitemap.xml',
  };
}