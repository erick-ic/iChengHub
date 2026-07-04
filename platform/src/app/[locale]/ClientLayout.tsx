'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import Footer, { EMAIL } from '@/components/layout/Footer';
import { copyToClipboard } from '@/lib/copyUtils';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const t = useTranslations('footer');
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    const success = await copyToClipboard(EMAIL);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {children}
      <Footer onCopyEmail={handleCopyEmail} copied={copied} />
      {copied && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg animate-bounce pointer-events-auto">
            <Check className="w-5 h-5 text-green-400" />
            <span>{t('copiedEmail')} <span className="text-gray-300 font-mono">{EMAIL}</span></span>
          </div>
        </div>
      )}
    </div>
  );
}
