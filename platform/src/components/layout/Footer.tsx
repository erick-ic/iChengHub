'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Mail } from 'lucide-react';

const ICP_NUMBER = '2025085990';
export const EMAIL = 'ichenghub@gmail.com';

interface FooterProps {
  onCopyEmail: () => void;
  copied: boolean;
}

export default function Footer({ onCopyEmail, copied }: FooterProps) {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#f5f5f7] dark:bg-[#0a0a0d]">
      <div className="max-w-7xl mx-auto px-6 py-4 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-gray-400 dark:text-gray-500">
          <div className="flex items-center justify-center md:justify-start gap-3">
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
            <span className="hidden md:block w-[1px] h-3 bg-gray-200 dark:bg-gray-800 shrink-0" />
            <a
              href="https://beian.miit.gov.cn"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block text-gray-400 dark:text-gray-500 hover:text-[#e52129] transition-colors duration-200 no-underline"
            >
              {t('icp', { number: ICP_NUMBER })}
            </a>
          </div>

          <div className="flex items-center justify-center md:justify-end gap-2 md:gap-6">
            <button
              onClick={onCopyEmail}
              className="flex items-center gap-2 text-gray-400 hover:text-[#e52129] transition-colors duration-200 cursor-pointer group"
              title={t('emailTooltip')}
            >
              <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">{copied ? t('copied') : t('contact')}</span>
            </button>
            <span className="hidden sm:block md:text-right">
              {t('copyright', { year })}
            </span>
          </div>
        </div>

        <div className="sm:hidden mt-2 flex flex-col items-center gap-1.5">
          <span className="text-center text-xs text-gray-400 dark:text-gray-500">
            {t('copyright', { year })}
          </span>
          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
            <a
              href="https://beian.miit.gov.cn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#e52129] transition-colors duration-200 no-underline"
            >
              {t('icp', { number: ICP_NUMBER })}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
