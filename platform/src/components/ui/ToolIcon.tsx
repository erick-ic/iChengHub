'use client';

import { useState, useEffect } from 'react';

interface ToolIconProps {
  url: string;
  title: string;
  iconUrl?: string;
}

const COLOR_PALETTES = [
  { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  { bg: 'bg-blue-50', text: 'text-blue-600' },
  { bg: 'bg-green-50', text: 'text-green-600' },
  { bg: 'bg-pink-50', text: 'text-pink-600' },
  { bg: 'bg-orange-50', text: 'text-orange-600' },
  { bg: 'bg-red-50', text: 'text-red-600' },
  { bg: 'bg-teal-50', text: 'text-teal-600' },
  { bg: 'bg-violet-50', text: 'text-violet-600' },
];

function getColorPalette(title: string): typeof COLOR_PALETTES[0] {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLOR_PALETTES[Math.abs(hash) % COLOR_PALETTES.length];
}

const getDomain = (urlString: string): string => {
  try {
    const url = new URL(urlString);
    return url.hostname.replace('www.', '');
  } catch {
    return urlString;
  }
};

export function ToolIcon({ url, title, iconUrl }: ToolIconProps) {
  const [currentProviderIndex, setCurrentProviderIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  
  const palette = getColorPalette(title);
  const initial = title.charAt(0).toUpperCase();
  const domain = getDomain(url);

  // 多个 favicon 服务提供商，按优先级排列
  const faviconProviders = [
    `https://www.google.cn/s2/favicons?domain=${domain}&sz=128`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://favicon.yandex.net/favicon/${domain}`,
    `https://api.faviconkit.com/${domain}/128`,
  ];

  // 如果提供了 iconUrl，优先使用；否则尝试从 URL 抓取 favicon
  const iconUrls = iconUrl ? [iconUrl] : faviconProviders;
  const finalIconUrl = iconUrls[currentProviderIndex];

  const handleImageError = () => {
    if (currentProviderIndex < iconUrls.length - 1) {
      setCurrentProviderIndex(prev => prev + 1);
    } else {
      setHasError(true);
    }
  };

  // 处理空 URL 的情况
  if (!url || url.trim() === '') {
    return (
      <div className="w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
        <div className={`w-full h-full flex items-center justify-center ${palette.bg}`}>
          <span className={`font-bold text-xl ${palette.text}`}>
            {initial}
          </span>
        </div>
      </div>
    );
  }

  return (
    // 外层容器添加圆角和 overflow-hidden
    <div className="relative w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
      {/* 背景容器 */}
      <div className={`absolute inset-0 ${!hasError ? 'bg-gray-100' : palette.bg}`} />
      
      {/* 初始字母占位 */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold text-xl ${palette.text}`}>
            {initial}
          </span>
        </div>
      )}
      
      {/* 图片 - 使用 object-cover 填充容器 */}
      {!hasError && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={finalIconUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={handleImageError}
        />
      )}
      
      {/* hover 效果层 */}
      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </div>
  );
}