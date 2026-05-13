'use client';

import { useEffect, useTransition } from 'react';
import { useLocale } from 'next-intl';
import { trackResourceAction } from '@/app/actions/statsActions';

interface PageViewTrackerProps {
  path?: string;
  resourceId?: string;
  resourceType?: string;
}

function getCookie(name: string): boolean {
  if (typeof document === 'undefined') return false;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return true;
  return false;
}

function setCookie(name: string, maxAge: number) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=1; max-age=${maxAge}; path=/; samesite=lax`;
}

export default function PageViewTracker({ path = '', resourceId = '', resourceType = 'PAGE' }: PageViewTrackerProps) {
  const [, startTransition] = useTransition();
  const locale = useLocale();

  useEffect(() => {
    const cookieName = `view_lock_${resourceType}_${resourceId || 'home'}`;

    if (getCookie(cookieName)) {
      return;
    }

    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
    const maxAge = Math.floor((midnight.getTime() - now.getTime()) / 1000);
    
    setCookie(cookieName, maxAge);

    let fullPath = path;
    if (fullPath && !fullPath.startsWith('/' + locale)) {
      fullPath = '/' + locale + fullPath;
    }

    startTransition(() => {
      trackResourceAction(resourceId, resourceType, 'VIEW', fullPath);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}