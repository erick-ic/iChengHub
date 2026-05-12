'use client';

import { useEffect, useTransition } from 'react';
import { incrementViews } from '@/app/actions/statsActions';

interface ViewsTrackerProps {
  promptId: string;
  path?: string;
}

export default function ViewsTracker({ promptId, path = '' }: ViewsTrackerProps) {
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      incrementViews(promptId, path);
    });
  }, [promptId, path]);

  return null;
}