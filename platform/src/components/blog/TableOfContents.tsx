'use client';

import { useEffect, useState, useRef } from 'react';
import { ChevronUp } from 'lucide-react';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
  isEnglish: boolean;
}

export default function TableOfContents({ items, isEnglish }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const headings = items.map((item) => document.getElementById(item.id)).filter(Boolean);

    if (headings.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -30% 0%',
        threshold: 0.1,
      }
    );

    headings.forEach((heading) => {
      if (heading) observerRef.current?.observe(heading);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [items]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (items.length === 0) return null;

  return (
    <aside className="hidden lg:block sticky top-24 self-start">
      {/* 左侧垂直引导线 */}
      <div className="relative pl-4 border-l border-gray-200 dark:border-gray-700">
        {/* 标题 */}
        <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-500 dark:text-gray-400 mb-4">
          {isEnglish ? 'On This Page' : '此页上'}
        </h3>

        {/* 大纲列表 */}
        <nav className="space-y-1">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block text-sm transition-colors duration-200 py-1 ${
                item.level === 3 ? 'pl-4' : ''
              } ${activeId === item.id ? 'text-[#e52129] font-medium' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
            >
              {item.text}
            </a>
          ))}
        </nav>

        {/* 物理分割线 */}
        <div className="border-t border-gray-100 dark:border-gray-800 my-6" />

        {/* 标签区域 / 返回顶部按钮 */}
        <div
          className={`transition-all duration-300 ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        >
          {showBackToTop ? (
            <button
              onClick={handleBackToTop}
              className="flex items-center gap-2 px-4 py-2 bg-[#e52129] text-white text-sm font-medium rounded-lg hover:bg-[#c41d24] transition-colors"
            >
              <ChevronUp className="h-4 w-4" />
              {isEnglish ? 'Back to Top' : '回到顶部'}
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{isEnglish ? 'Tags' : '标签'}</span>
              <span className="text-[#e52129] font-medium">#tech</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}