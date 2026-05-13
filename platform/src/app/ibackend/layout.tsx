import type { Metadata } from 'next';
import AdminLayout from '@/components/layout/AdminLayout';

export const metadata: Metadata = {
  title: '系统管理',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function IBackendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className="font-sans">
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}