"use client";
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface ToolCardProps {
  tool: {
    id: string;
    nameKey: string;
    descKey: string;
    coverImage: string;
    category: string;
    url: string;
  };
}

export default function ToolCard({ tool }: ToolCardProps) {
  const t = useTranslations('HomePage');

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer">
      {/* 上方图片区域：固定比例 3:2 */}
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-t-2xl">
        <Image
          src={tool.coverImage}
          alt={t(tool.nameKey)}
          fill
          priority={tool.id === '1'} // 第一张图片添加优先级
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ borderRadius: 'inherit' }}
        />
        {/* 图片蒙版效果 */}
        <div className="absolute inset-0 bg-black/5 transition-opacity duration-300 group-hover:opacity-0 rounded-t-2xl" />
      </div>

      {/* 下方文字区域 */}
      <div className="flex flex-col p-5">
        <h3 className="text-xl font-bold text-zinc-900 group-hover:text-red-600 transition-colors">
          {t(tool.nameKey)}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500">
          {t(tool.descKey)}
        </p>
      </div>
    </div>
  );
}