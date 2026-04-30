import { getTranslations } from 'next-intl/server';
import ToolCard from '@/components/ToolCard';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface Tool {
  id: string;
  name: string;
  nameEn: string | null;
  desc: string;
  descEn: string | null;
  logoUrl: string;
  category: string;
  url: string;
}

async function fetchTools(): Promise<Tool[]> {
  const tools = await prisma.toolCard.findMany({
    orderBy: { createdAt: 'asc' }
  });
  console.log('Fetched cards from database:', tools.length);
  return tools;
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  const tools = await fetchTools();

  const displayTools = tools.map(tool => ({
    ...tool,
    displayName: locale === 'en' && tool.nameEn ? tool.nameEn : tool.name,
    displayDesc: locale === 'en' && tool.descEn ? tool.descEn : tool.desc,
  }));

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-4">
          {t('title')}
        </h1>
        <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
          {t('description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayTools.map((tool, index) => (
          <ToolCard key={tool.id} tool={tool} isFirst={index === 0} />
        ))}
      </div>
    </section>
  );
}