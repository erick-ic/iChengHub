'use client';

import { useState, useEffect, useRef } from 'react';

interface ToolIconProps {
  url: string;
  title: string;
  iconUrl?: string;
}

const COLOR_PALETTES = [
  { from: 'from-indigo-500/10', to: 'to-purple-500/10', text: 'text-indigo-600', border: 'border-indigo-100' },
  { from: 'from-blue-500/10', to: 'to-cyan-500/10', text: 'text-blue-600', border: 'border-blue-100' },
  { from: 'from-green-500/10', to: 'to-emerald-500/10', text: 'text-green-600', border: 'border-green-100' },
  { from: 'from-pink-500/10', to: 'to-rose-500/10', text: 'text-pink-600', border: 'border-pink-100' },
  { from: 'from-orange-500/10', to: 'to-amber-500/10', text: 'text-orange-600', border: 'border-orange-100' },
  { from: 'from-red-500/10', to: 'to-rose-500/10', text: 'text-red-600', border: 'border-red-100' },
  { from: 'from-teal-500/10', to: 'to-cyan-500/10', text: 'text-teal-600', border: 'border-teal-100' },
  { from: 'from-violet-500/10', to: 'to-purple-500/10', text: 'text-violet-600', border: 'border-violet-100' },
];

const LOAD_TIMEOUT = 5000;

function getColorPalette(title: string): typeof COLOR_PALETTES[0] {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLOR_PALETTES[Math.abs(hash) % COLOR_PALETTES.length];
}

const getDomain = (urlString: string) => {
  try {
    const url = new URL(urlString);
    return url.hostname;
  } catch {
    return urlString;
  }
};

export function ToolIcon({ url, title, iconUrl }: ToolIconProps) {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const palette = getColorPalette(title);
  const initial = title.charAt(0).toUpperCase();

  const domain = getDomain(url);
  
  const iconUrls = [
    iconUrl,
    `https://www.google.cn/s2/favicons?domain=${domain}&sz=128`,
    `https://api.uomg.com/api/get.favicon?url=${encodeURIComponent(url)}`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  ].filter(Boolean) as string[];

  const currentIconUrl = iconUrls[currentUrlIndex];

  useEffect(() => {
    if (!currentIconUrl) {
      setHasError(true);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      if (currentUrlIndex < iconUrls.length - 1) {
        setCurrentUrlIndex(prev => prev + 1);
      } else {
        setHasError(true);
      }
    }, LOAD_TIMEOUT);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIconUrl, currentUrlIndex, iconUrls.length]);

  const handleImageError = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (currentUrlIndex < iconUrls.length - 1) {
      setCurrentUrlIndex(prev => prev + 1);
    } else {
      setHasError(true);
    }
  };

  const handleImageLoad = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsImageLoaded(true);
    setHasError(false);
  };

  const containerClass = 'relative w-12 h-12 flex items-center justify-center rounded-xl overflow-hidden transition-all duration-300 ' + (isImageLoaded ? 'border border-zinc-200/50 bg-white shadow-sm' : 'border ' + palette.border + ' bg-gradient-to-br ' + palette.from + ' ' + palette.to);

  return (
    <div className={containerClass}>
      {!isImageLoaded && (
        <span className={'font-bold text-lg ' + palette.text + ' transition-opacity duration-300 ' + (isImageLoaded ? 'opacity-0' : 'opacity-100')}>
          {initial}
        </span>
      )}
      {currentIconUrl && !hasError && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={currentIconUrl}
          alt={title}
          className={'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 object-contain transition-opacity duration-300 ' + (isImageLoaded ? 'opacity-100' : 'opacity-0')}
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  );
}
