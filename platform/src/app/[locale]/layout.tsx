import type { Metadata } from 'next';
import './../globals.css';
import Navbar from '@/components/Navbar';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export const metadata: Metadata = {
  title: {
    template: '%s | 热荐工坊 - iChengHub',
    default: '热荐工坊 - 探索 AI 的边界，你的专属效率罗盘',
  },
  description: '和光工作室倾力打造的 AI 纯净工坊。收录全网高质量 AI 工具与实战提示词，拒绝套壳广告，只推荐真正提升生产力的 AI 杠杆。',
  keywords: ['AI工具', 'ChatGPT提示词', 'AI导航', '效率工具', 'Prompt实战', '独立开发者'],
  authors: [{ name: '和光工作室' }],
  openGraph: {
    title: '热荐工坊 - AI 效率罗盘',
    description: '拒绝垃圾与满屏广告，站长亲测的高质量 AI 工具与提示词大本营。',
    url: 'https://ichenghub.cn',
    siteName: '热荐工坊',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '热荐工坊 - AI 效率罗盘',
    description: '拒绝垃圾与满屏广告，站长亲测的高质量 AI 工具与提示词大本营。',
  },
  icons: {
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