"use client";
import Image from 'next/image';
import { useRouter } from '@/navigation';
import { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    nameEn: string | null;
    desc: string;
    descEn: string | null;
    logoUrl: string;
    category: string;
    url: string | null;
    displayName?: string;
    displayDesc?: string;
  };
  isFirst?: boolean;
}

const PROMPT_CATEGORIES = ['提示词', 'Prompts', 'prompt', '提示词工程'];

export default function ToolCard({ tool, isFirst = false }: ToolCardProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const t = useTranslations('HomePage');

  const isPromptCard = PROMPT_CATEGORIES.some(cat => 
    tool.category.includes(cat) || tool.category.toLowerCase().includes(cat.toLowerCase())
  );

  const handleClick = () => {
    if (isPromptCard) {
      router.push('/prompts');
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`group flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white transition-all cursor-pointer ${
          isFirst ? 'hover:shadow-xl hover:-translate-y-1' : 'hover:shadow-md'
        }`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl">
          <Image
            src={tool.logoUrl}
            alt={tool.displayName || tool.name}
            fill
            priority={tool.id === '1'}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="transition-transform duration-500 group-hover:scale-105"
            style={{
              objectFit: 'cover',
              objectPosition: 'top center'
            }}
            unoptimized={tool.logoUrl?.startsWith('http')}
          />
          <div className="absolute inset-0 bg-black/5 transition-opacity duration-300 group-hover:opacity-0 rounded-t-2xl" />
        </div>

        <div className="flex flex-col p-5">
          <h3 className="text-xl font-bold text-zinc-900 group-hover:text-red-600 transition-colors">
            {tool.displayName || tool.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500">
            {tool.displayDesc || tool.desc}
          </p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-10 max-w-md mx-4 text-center shadow-2xl transform animate-in zoom-in-95 duration-300">
            <div className="text-7xl mb-6">🚧</div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-3">
              {t('comingSoon')}
            </h3>
            <p className="text-zinc-500 mb-6 leading-relaxed">
              {t('comingSoonDesc', { name: tool.displayName || tool.name })}
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-800 transition-colors"
            >
              <X size={18} />
              {t('iKnow')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
