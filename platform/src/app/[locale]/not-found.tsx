import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function NotFound() {
  const t = useTranslations('notFound');
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center">
        <div className="text-6xl font-bold text-gray-900 mb-4">404</div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-gray-500 mb-6">{t('description')}</p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
        >
          {t('backToHome')}
        </Link>
      </div>
    </div>
  );
}
