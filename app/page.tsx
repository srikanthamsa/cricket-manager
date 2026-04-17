'use client';

import dynamic from 'next/dynamic';

const CricketApp = dynamic(() => import('@/components/cricket-app'), { ssr: false });

export default function Page() {
  return <CricketApp />;
}
