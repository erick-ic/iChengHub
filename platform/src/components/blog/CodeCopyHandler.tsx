'use client';

import { useEffect } from 'react';
import { trackResourceAction } from '@/app/actions/statsActions';

interface CodeCopyHandlerProps {
  blogId?: string;
  locale?: string;
}

export default function CodeCopyHandler({ blogId, locale }: CodeCopyHandlerProps) {
  useEffect(() => {
    const handleCopyClick = (e: MouseEvent) => {
      const button = (e.target as HTMLElement).closest('.copy-button');
      if (!button) return;

      e.preventDefault();
      e.stopPropagation();

      const container = button.parentElement;
      const pre = container?.querySelector('pre');
      const code = pre?.querySelector('code');
      const codeText = code?.textContent || pre?.textContent || '';

      if (!codeText) return;

      navigator.clipboard.writeText(codeText.trim()).then(() => {
        button.classList.add('copied');

        setTimeout(() => {
          button.classList.remove('copied');
        }, 2000);

        if (blogId) {
          let fullPath = locale ? `/${locale}/blog/${blogId}` : `/blog/${blogId}`;
          trackResourceAction(blogId, 'BLOG', 'COPY', fullPath).catch(() => {});
        }
      }).catch((err) => {
        console.error('Failed to copy:', err);
      });
    };

    document.addEventListener('click', handleCopyClick, { passive: true });
    return () => document.removeEventListener('click', handleCopyClick);
  }, [blogId, locale]);

  return null;
}
