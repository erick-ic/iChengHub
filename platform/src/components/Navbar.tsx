'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';
import { GlobalSearch, SearchItem } from './layout/GlobalSearch';

interface NavbarProps {
  locale: string;
}

const Navbar: React.FC<NavbarProps> = ({ locale }) => {
  const t = useTranslations('navbar');
  const pathname = usePathname();
  const nextLocale = locale === 'en' ? 'zh' : 'en';
  const [searchItems, setSearchItems] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 获取搜索数据
  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const response = await fetch('/api/search');
        const data = await response.json();
        setSearchItems(data);
      } catch (error) {
        console.error('Failed to fetch search data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchData();
  }, []);

  return (
    <nav className="h-16 bg-background border-b border-border flex justify-between items-center px-8">
      {/* 左侧 Logo */}
      <Link href="/" className="flex items-center group no-underline">
        <div className="flex items-baseline font-extrabold italic tracking-tighter">
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

        {/* 全局搜索组件 */}
        <GlobalSearch items={searchItems} isEnglish={locale === 'en'} />

        {/* 行动按钮 */}
        <Link
          href="/submit"
          className="bg-foreground text-background px-4 py-2 rounded-full flex items-center text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {t('submitButton')}
          <ArrowUpRight className="ml-2 h-3 w-3 transform rotate-45" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;