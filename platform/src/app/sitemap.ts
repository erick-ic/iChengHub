import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ichenghub.cn';

  // 静态路由
  const staticRoutes = [
    { url: `${baseUrl}/zh`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/en`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/zh/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/en/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/zh/tools`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/en/tools`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/zh/prompts`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/en/prompts`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/zh/links`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/en/links`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/zh/submit`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/en/submit`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
  ];

  // 动态路由 - 工具详情页
  const tools = await prisma.toolCard.findMany({ 
    where: { status: 1 },
    select: { id: true, updatedAt: true }
  });
  
  const toolRoutes = tools.map((tool) => ({
    url: `${baseUrl}/zh/tools/${tool.id}`,
    lastModified: tool.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // 动态路由 - 提示词详情页
  const prompts = await prisma.prompt.findMany({ 
    where: { status: 1 },
    select: { id: true, updatedAt: true }
  });
  
  const promptRoutes = prompts.map((prompt) => ({
    url: `${baseUrl}/zh/prompts/${prompt.id}`,
    lastModified: prompt.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...toolRoutes, ...promptRoutes];
}