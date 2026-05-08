import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // 获取工具数据
    const tools = await prisma.toolCard.findMany({
      where: { status: 1 },
      select: {
        id: true,
        name: true,
        nameEn: true,
        desc: true,
        descEn: true,
        url: true,
        logoUrl: true,
        category: true,
        categoryEn: true,
      },
    });

    // 获取导航链接数据（使用 NavLink 模型）
    const links = await prisma.navLink.findMany({
      where: { status: 1 },
      select: {
        id: true,
        name: true,
        nameEn: true,
        desc: true,
        descEn: true,
        url: true,
        iconUrl: true,
        category: true,
        categoryEn: true,
      },
    });

    // 获取提示词数据
    const prompts = await prisma.prompt.findMany({
      where: { status: 1 },
      select: {
        id: true,
        title: true,
        titleEn: true,
        promptText: true,
        category: true,
        categoryEn: true,
      },
    });

    // 转换为统一格式 - 工具
    const toolItems = tools.map((tool) => ({
      id: tool.id,
      title: tool.name,
      titleEn: tool.nameEn,
      description: tool.desc,
      descriptionEn: tool.descEn,
      url: tool.url || '',
      iconUrl: tool.logoUrl,
      category: tool.category,
      categoryEn: tool.categoryEn,
      type: 'tool' as const,
    }));

    // 转换为统一格式 - 链接
    const linkItems = links.map((link) => ({
      id: link.id,
      title: link.name,
      titleEn: link.nameEn,
      description: link.desc,
      descriptionEn: link.descEn,
      url: link.url,
      iconUrl: link.iconUrl,
      category: link.category,
      categoryEn: link.categoryEn,
      type: 'link' as const,
    }));

    // 转换为统一格式 - 提示词
    const promptItems = prompts.map((prompt) => ({
      id: prompt.id,
      title: prompt.title,
      titleEn: prompt.titleEn,
      description: prompt.promptText.substring(0, 100) + (prompt.promptText.length > 100 ? '...' : ''),
      descriptionEn: prompt.promptText.substring(0, 100) + (prompt.promptText.length > 100 ? '...' : ''),
      url: `/prompts/${prompt.id}`, // 站内详情页链接
      iconUrl: undefined,
      category: prompt.category,
      categoryEn: prompt.categoryEn,
      type: 'prompt' as const,
    }));

    // 合并并返回
    const allItems = [...toolItems, ...linkItems, ...promptItems];

    return NextResponse.json(allItems);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}