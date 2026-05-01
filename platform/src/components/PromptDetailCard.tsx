'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export interface PromptDetailData {
  id: string;
  title: string;
  titleEn: string | null;
  promptText: string;
  description?: string;
}

interface PromptDetailCardProps {
  data: PromptDetailData;
  isEnglish?: boolean;
  isPortrait?: boolean;
}

export default function PromptDetailCard({ data, isEnglish = false, isPortrait = false }: PromptDetailCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isPortrait) {
    return (
      <div className="space-y-4">
        <div className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-700/50 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-700/30">
            <span className="text-white/80 text-sm font-semibold">
              {isEnglish ? 'Prompt' : '提示词'}
            </span>
            <button
              onClick={handleCopy}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all"
              title={isEnglish ? 'Copy Prompt' : '复制提示词'}
            >
              {copied ? (
                <>
                  <Check size={14} className="text-green-400" />
                  <span className="text-green-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    {isEnglish ? 'Copied!' : '已复制！'}
                  </span>
                </>
              ) : (
                <>
                  <Copy size={14} className="text-white/60" />
                  <span className="text-white/60 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    {isEnglish ? 'Copy' : '复制'}
                  </span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 font-mono text-xs leading-relaxed text-white/90 whitespace-pre-wrap break-all max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800">
            {data.promptText}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-200 bg-zinc-50/50">
          <span className="text-zinc-700 text-sm font-semibold">
            {isEnglish ? 'Prompt' : '提示词'}
          </span>
          <button
            onClick={handleCopy}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-zinc-200 transition-all"
            title={isEnglish ? 'Copy Prompt' : '复制提示词'}
          >
            {copied ? (
              <>
                <Check size={16} className="text-green-600" />
                <span className="text-green-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                  {isEnglish ? 'Copied!' : '已复制！'}
                </span>
              </>
            ) : (
              <>
                <Copy size={16} className="text-zinc-600" />
                <span className="text-zinc-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                  {isEnglish ? 'Copy Prompt' : '复制提示词'}
                </span>
              </>
            )}
          </button>
        </div>

        <div className="p-6 font-mono text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap break-all max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-zinc-100 bg-zinc-50">
          {data.promptText}
        </div>
      </div>
    </div>
  );
}
