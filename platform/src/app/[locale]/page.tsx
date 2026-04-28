'use client';

import { useTranslations } from 'next-intl';
import ToolCard from '@/components/ToolCard';
import { tools } from '@/constants/tools';

export default function Home() {
  const t = useTranslations('HomePage');
  
  return (
    <section className="container mx-auto px-4 py-16">
      {/* 标题区 */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-4">
          {t('title')}
        </h1>
        <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
          {t('description')}
        </p>
      </div>

      {/* 卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}