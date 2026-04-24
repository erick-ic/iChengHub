'use client';

import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('layout');
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      <p className="text-muted-foreground">{t('description')}</p>
    </div>
  );
}
