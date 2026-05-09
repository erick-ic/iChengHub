import type { Metadata } from 'next';
import './globals.css';

// 使用系统字体替代 Google Fonts
const inter = { className: 'font-sans' };

export const metadata: Metadata = {
  title: 'iChengHub',
  description: 'AI Tool Card Portal',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}