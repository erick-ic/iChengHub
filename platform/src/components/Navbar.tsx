'use client';

import React from 'react';
import { Search, ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';

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
        <Link
          href="/"
          className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-1.5 rounded-md transition-colors"
        >
          {t('home')}
        </Link>
        <Link
          href="/tools"
          className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-1.5 rounded-md transition-colors"
        >
          {t('tools')}
        </Link>
        <Link
          href="/links"
          className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-1.5 rounded-md transition-colors"
        >
          {t('links')}
        </Link>
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
          className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md transition-colors uppercase tracking-wider"
        >
          {nextLocale === 'en' ? 'EN' : 'ZH'}
        </Link>

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
