"use client";
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from '@/navigation';
import { ArrowRight, X } from 'lucide-react';
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

export default function ToolCard({ tool, isFirst = false }: ToolCardProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const t = useTranslations('HomePage');
  
  const title = tool.displayName || tool.name;
  const description = tool.displayDesc || tool.desc;

  const handleClick = () => {
    if (!tool.url) {
      // 没有 URL，显示弹窗
      setShowModal(true);
      return;
    }

    // 判断是站内路径还是站外链接
    if (tool.url.startsWith('/')) {
      // 站内路径：使用 next/router 进行客户端导航
      router.push(tool.url);
    } else if (tool.url.startsWith('http://') || tool.url.startsWith('https://')) {
      // 站外链接：在新窗口打开
      window.open(tool.url, '_blank');
    } else {
      // 其他情况（相对路径等），尝试作为站内路径处理
      router.push('/' + tool.url);
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
            alt={title}
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
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-zinc-900 group-hover:text-red-600 transition-colors">
              {title}
            </h3>
            <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500">
            {description}
          </p>
        </div>
      </div>

      {/* 弹窗 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-10 max-w-md mx-4 text-center shadow-2xl transform animate-in zoom-in-95 duration-300">
            <div className="text-7xl mb-6">🚧</div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-3">
              {t('comingSoon')}
            </h3>
            <p className="text-zinc-500 mb-6 leading-relaxed">
              {t('comingSoonDesc', { name: title })}
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
