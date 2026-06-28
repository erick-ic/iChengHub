'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from '@/navigation';
import { trackResourceAction } from '@/app/actions/statsActions';

interface CopyGenerateButtonProps {
  promptText: string;
  platformUrl: string;
  promptId: string;
  isEnglish?: boolean;
}

export default function CopyGenerateButton({
  promptText,
  platformUrl,
  promptId,
  isEnglish = false
}: CopyGenerateButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();

  const handleClick = () => {
    navigator.clipboard.writeText(promptText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(() => {});

    const fullPath = `/${locale}${pathname}`;
    window.open(platformUrl, '_blank', 'noopener,noreferrer');
    trackResourceAction(promptId, 'PROMPT', 'COPY', fullPath).catch(() => {});
  };

  return (
    <button
      onClick={handleClick}
      className="w-full h-14 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-2xl font-semibold flex items-center justify-center shadow-lg shadow-zinc-900/20 hover:shadow-xl hover:shadow-zinc-900/30 hover:from-zinc-700 hover:to-zinc-800 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
    >
      {isCopied ? (isEnglish ? 'Copied!' : '已复制') : (isEnglish ? 'Copy & Generate' : '复制去生成')}
    </button>
  );
}
