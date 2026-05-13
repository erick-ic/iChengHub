import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      // 必须以数组形式，显式放行前端静态资源，解决 SEO 渲染被拦截的问题
      allow: ['/', '/_next/static/'],
      disallow: [
        '/api/', // 阻止搜索引擎消耗你的接口资源
        '/_next/', // 拦截除了 static 之外的其他内部编译缓存
        // 绝对不能在这里写出真实的后台地址
      ],
    },
    sitemap: 'https://ichenghub.cn/sitemap.xml',
  };
}