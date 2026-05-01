'use client';

import { useEffect, useTransition } from 'react';
import { incrementViews } from '@/app/actions/statsActions';

interface ViewsTrackerProps {
  promptId: string;
}

export default function ViewsTracker({ promptId }: ViewsTrackerProps) {
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      incrementViews(promptId);
    });
  }, [promptId]);

  return null;
}
