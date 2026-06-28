import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withMetrics } from '@/app/actions/withMetrics';

export const dynamic = 'force-dynamic';

const handler = async function GET() {
  try {
    const tools = await prisma.toolCard.findMany({
      where: { status: 1 },
      select: {
        id: true, name: true, nameEn: true, desc: true, descEn: true,
        url: true, logoUrl: true, category: true, categoryEn: true,
      },
    });

    const links = await prisma.navLink.findMany({
      where: { status: 1 },
      select: {
        id: true, name: true, nameEn: true, desc: true, descEn: true,
        url: true, iconUrl: true, category: true, categoryEn: true,
      },
    });

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

    const allItems = [...toolItems, ...linkItems];

    return NextResponse.json(allItems, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
      },
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json([], { status: 500 });
  }
};

export { handler as GET };
