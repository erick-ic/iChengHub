import type { Metadata } from 'next';
import BackendLogin from '@/components/layout/BackendLogin';

export const metadata: Metadata = {
  title: '系统登录',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function IBackendLoginPage() {
  return <BackendLogin />;
}