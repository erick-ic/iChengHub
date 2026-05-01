import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './../globals.css';
import Navbar from '@/components/Navbar';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap'
});

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