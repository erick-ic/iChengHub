'use client';

import { useState } from 'react';

interface CopyGenerateButtonProps {
  promptText: string;
  platformUrl: string;
  isEnglish?: boolean;
}

export default function CopyGenerateButton({ 
  promptText, 
  platformUrl, 
  isEnglish = false 
}: CopyGenerateButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      window.open(platformUrl, '_blank');
    } catch (err) {
      console.error('复制失败', err);
    }
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
