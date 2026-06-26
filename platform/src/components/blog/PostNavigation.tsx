'use client';

import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

interface NavPost {
  id: string;
  titleZh: string;
  titleEn: string;
}

interface PostNavigationProps {
  prevPost: NavPost | null;
  nextPost: NavPost | null;
  isEnglish: boolean;
}

export default function PostNavigation({ prevPost, nextPost, isEnglish }: PostNavigationProps) {
  const t = useTranslations('blog');

  const getTitle = (post: NavPost) => {
    return isEnglish ? post.titleEn : post.titleZh;
  };

  return (
    <nav className="border-t border-gray-100 dark:border-gray-800 pt-6 flex items-center justify-between">
      <Link
        href={prevPost ? `/blog/${prevPost.id}` : '/blog'}
        className="flex items-center gap-2 text-sm md:text-base text-gray-600 dark:text-gray-400 hover:text-[#e52129] transition-colors duration-200 max-w-[45%]"
      >
        <span className="shrink-0">←</span>
        <span className="truncate">
          {prevPost ? getTitle(prevPost) : t('backToList')}
        </span>
      </Link>

      <Link
        href={nextPost ? `/blog/${nextPost.id}` : '/blog'}
        className="flex items-center gap-2 text-sm md:text-base text-gray-600 dark:text-gray-400 hover:text-[#e52129] transition-colors duration-200 max-w-[45%] justify-end"
      >
        <span className="truncate">
          {nextPost ? getTitle(nextPost) : t('backToList')}
        </span>
        <span className="shrink-0">→</span>
      </Link>
    </nav>
  );
}
