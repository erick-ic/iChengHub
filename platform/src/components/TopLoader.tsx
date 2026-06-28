'use client';

import TopLoaderLibrary from 'nextjs-toploader';

export default function TopLoader() {
  return (
    <TopLoaderLibrary
      color="#e52129"
      initialPosition={0.08}
      crawlSpeed={800}
      height={2}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={300}
      shadow="none"
      zIndex={9999}
    />
  );
}
