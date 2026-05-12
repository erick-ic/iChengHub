'use client';

import { useEffect, useTransition } from 'react';
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

  useEffect(() => {
    const cookieName = `view_lock_${resourceType}_${resourceId || 'home'}`;

    if (getCookie(cookieName)) {
      return;
    }

    setCookie(cookieName, 60 * 60 * 24);

    startTransition(() => {
      trackResourceAction(resourceId, resourceType, 'VIEW', path);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}