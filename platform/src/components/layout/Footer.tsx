'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

const ICP_NUMBER = '2025085990';

export default function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#f5f5f7] dark:bg-[#0a0a0d]">
      <div className="max-w-7xl mx-auto px-6 py-4 md:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-gray-400 dark:text-gray-500">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="no-underline shrink-0">
            <div className="flex items-baseline font-extrabold italic tracking-tighter">
              <span className="text-base md:text-lg text-black dark:text-white">
                iCheng
              </span>
              <span className="text-base md:text-lg text-[#e52129]">
                Hub
              </span>
            </div>
          </Link>
          <span className="w-[1px] h-3 bg-gray-200 dark:bg-gray-800 shrink-0" />
          <a
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 dark:text-gray-500 hover:text-[#e52129] transition-colors duration-200 no-underline min-w-0 break-words"
          >
            {t('icp', { number: ICP_NUMBER })}
          </a>
        </div>

        <span className="min-w-0 break-words text-center sm:text-right">
          {t('copyright', { year })}
        </span>
      </div>
    </footer>
  );
}
