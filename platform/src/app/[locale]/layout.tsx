import { Metadata } from 'next';
import './../globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isEn = params.locale === 'en';
  return {
    metadataBase: new URL('https://ichenghub.cn'),
    title: {
      template: isEn ? '%s | iChengHub Efficiency Compass' : '%s | iChengHub 效率罗盘',
      default: isEn ? 'iChengHub - Explore AI Boundaries, Your Efficiency Compass' : '热荐工坊 - 探索 AI 的边界，你的专属效率罗盘',
    },
    description: isEn
      ? 'Pure AI workshop crafted by Heguang Studio. Curating high-quality, ad-free AI productivity tools and prompts.'
      : '和光工作室倾力打造的 AI 纯净工坊。收录全网高质量、无广告套壳的 AI 效率工具与生产力提示词。',
    keywords: isEn
      ? ['AI Tools', 'ChatGPT Prompts', 'AI Productivity', 'iChengHub', 'Independent Developer']
      : ['AI工具导航', 'ChatGPT提示词', 'AI效率工具', '热荐工坊', '独立开发者'],
    authors: [{ name: isEn ? 'Heguang Studio' : '和光工作室' }],
    alternates: {
      canonical: './',
    },
    openGraph: {
      title: isEn ? 'iChengHub - AI Efficiency Compass' : '热荐工坊 - AI 效率罗盘',
      description: isEn
        ? 'No ads, no bloatware. Hand-picked high-quality AI tools and prompts.'
        : '拒绝垃圾与满屏广告，站长亲测的高质量 AI 工具与提示词大本营。',
      url: 'https://ichenghub.cn',
      siteName: isEn ? 'iChengHub' : '热荐工坊',
      locale: isEn ? 'en_US' : 'zh_CN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? 'iChengHub - AI Efficiency Compass' : '热荐工坊 - AI 效率罗盘',
      description: isEn
        ? 'No ads, no bloatware. Hand-picked high-quality AI tools and prompts.'
        : '拒绝垃圾与满屏广告，站长亲测的高质量 AI 工具与提示词大本营。',
    },
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' }
      ],
      apple: '/favicon.svg',
    },
  };
}

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
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar locale={params.locale} />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}