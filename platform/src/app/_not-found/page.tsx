'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const t = useTranslations('notFound');

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('title')}
        </h1>
        <p className="text-gray-500 mb-6">
          {t('description')}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#e52129] text-white px-6 py-3 rounded-lg hover:bg-[#d11a22] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToHome')}
        </Link>
      </div>
    </div>
  );
}
