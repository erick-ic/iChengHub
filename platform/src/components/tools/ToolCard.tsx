"use client";
import { useState } from 'react';
import { useRouter } from '@/navigation';
import { ArrowRight, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ToolIcon } from '../ui/ToolIcon';

interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    nameEn: string | null;
    desc: string;
    descEn: string | null;
    logoUrl: string;
    url: string | null;
  };
  isEnglish: boolean;
}

export default function ToolCard({ tool, isEnglish }: ToolCardProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const t = useTranslations('HomePage');

  // 根据语言选择显示的标题和描述
  const title = isEnglish && tool.nameEn ? tool.nameEn : tool.name;
  const description = isEnglish && tool.descEn ? tool.descEn : tool.desc;

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
      <div className="group relative">
        <div
          onClick={handleClick}
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:bg-gray-50 transition-all cursor-pointer"
        >
          <ToolIcon url={tool.url || ''} title={tool.name} iconUrl={tool.logoUrl} />
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {title}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {description}
            </p>
          </div>
          
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
        </div>

        {/* Tooltip - 参照效率导航页面效果 */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-zinc-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 shadow-xl">
          <div className="font-semibold mb-1">{title}</div>
          <div className="text-zinc-300 text-xs leading-relaxed">{description}</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900"></div>
        </div>
      </div>

      {/* 弹窗 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-10 max-w-md mx-4 text-center shadow-2xl">
            <div className="text-7xl mb-6">🚧</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {t('comingSoon')}
            </h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              {t('comingSoonDesc', { name: title })}
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
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
