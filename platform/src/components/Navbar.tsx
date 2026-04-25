'use client';

import React from 'react';
import { ChevronDown, Search, ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';
// 主题切换组件 - 临时占位，等待实际组件实现
const ThemeToggle = () => (
  <button className="p-2 rounded-md hover:bg-muted transition-colors" aria-label="Toggle theme">
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  </button>
);

interface NavbarProps {
  locale: string;
}

const Navbar: React.FC<NavbarProps> = ({ locale }) => {
  const t = useTranslations('navbar');
  const pathname = usePathname();
  const nextLocale = locale === 'en' ? 'zh' : 'en';

  return (
    <nav className="h-16 bg-background border-b border-border flex justify-between items-center px-8">
      {/* 左侧 Logo */}
      <Link href="/" className="flex items-center group no-underline">
        <div 
          className="flex items-baseline font-extrabold italic tracking-tighter" 
          style={{ fontFamily: "'Exo 2', sans-serif" }}
        >
          {/* iCheng 部分 - 固定黑色 */}
          <span className="text-2xl md:text-3xl text-black">
            iCheng
          </span>
          {/* Hub 部分 - 固定红色 */}
          <span className="text-2xl md:text-3xl text-[#e52129]">
            Hub
          </span>
        </div>
      </Link>

      {/* 中间菜单 */}
      <div className="flex space-x-1">
        <a 
          href="#" 
          className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-1.5 rounded-md transition-colors"
        >
          {t('home')}
        </a>
        <a 
          href="#" 
          className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-1.5 rounded-md transition-colors flex items-center"
        >
          {t('tools')} <ChevronDown className="ml-1 h-3 w-3 text-muted-foreground" />
        </a>
        <a 
          href="#" 
          className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-1.5 rounded-md transition-colors flex items-center"
        >
          {t('links')} <ChevronDown className="ml-1 h-3 w-3 text-muted-foreground" />
        </a>
        <a 
          href="#" 
          className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-1.5 rounded-md transition-colors"
        >
          {t('about')}
        </a>
      </div>

      {/* 右侧区域 */}
      <div className="flex items-center space-x-4">
        {/* 语言切换按钮 */}
        <Link
          href={pathname}
          locale={nextLocale}
          className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md transition-colors"
        >
          {nextLocale === 'en' ? 'English' : '中文'}
        </Link>

        {/* 主题切换按钮 */}
        <ThemeToggle />

        {/* 搜索框 */}
        <div className="relative">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="rounded-full bg-muted pl-10 pr-4 py-2 w-64 text-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        {/* 行动按钮 */}
        <button className="bg-foreground text-background px-4 py-2 rounded-full flex items-center text-sm font-medium">
          {t('submitTool')}
          <ArrowUpRight className="ml-2 h-3 w-3 transform rotate-45" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;