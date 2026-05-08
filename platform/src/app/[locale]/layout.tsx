import type { Metadata } from 'next';
import './../globals.css';
import Navbar from '@/components/Navbar';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export const metadata: Metadata = {
  icons: {
    // 明确指定使用 svg 格式
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: '/favicon.svg',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages({ locale: params.locale });
  
  return (
    <NextIntlClientProvider messages={messages} locale={params.locale}>
      <div className="min-h-screen bg-background">
        <Navbar locale={params.locale} />
        {children}
      </div>
    </NextIntlClientProvider>
  );
}