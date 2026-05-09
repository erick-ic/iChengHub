'use client';

import { Sparkles } from 'lucide-react';
import { useState } from 'react';

interface GenerateButtonProps {
  promptText: string;
  toolUrl: string;
  isEnglish?: boolean;
}

export default function GenerateButton({ promptText, toolUrl, isEnglish = false }: GenerateButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      window.open(toolUrl, '_blank');
    } catch (err) {
      console.error('复制失败', err);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      className="w-full bg-gradient-to-r from-purple-300 to-purple-400 hover:from-purple-400 hover:to-purple-500 text-white px-6 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
    >
      <Sparkles size={18} />
      {isCopied ? (
        isEnglish ? 'Copied!' : '已复制！'
      ) : (
        isEnglish ? 'Copy & Generate' : '复制去生成'
      )}
    </button>
  );
}