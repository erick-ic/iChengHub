import type { Metadata } from 'next';
import AdminLayout from '@/components/layout/AdminLayout';

export const metadata: Metadata = {
  title: '系统管理',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function IBackendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>;
}