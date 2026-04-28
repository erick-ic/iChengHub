"use client";
import Image from 'next/image';

interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    nameEn: string | null;
    desc: string;
    descEn: string | null;
    logoUrl: string;
    category: string;
    url: string;
    displayName?: string;
    displayDesc?: string;
  };
}

export default function ToolCard({ tool }: ToolCardProps) {
  const displayName = tool.displayName || tool.name;
  const displayDesc = tool.displayDesc || tool.desc;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer">
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-t-2xl">
        <Image
          src={tool.logoUrl}
          alt={displayName}
          fill
          priority={tool.id === '1'}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ borderRadius: 'inherit' }}
        />
        <div className="absolute inset-0 bg-black/5 transition-opacity duration-300 group-hover:opacity-0 rounded-t-2xl" />
      </div>

      <div className="flex flex-col p-5">
        <h3 className="text-xl font-bold text-zinc-900 group-hover:text-red-600 transition-colors">
          {displayName}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500">
          {displayDesc}
        </p>
      </div>
    </div>
  );
}