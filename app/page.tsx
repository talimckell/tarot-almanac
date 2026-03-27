'use client';

import dynamic from 'next/dynamic';

const TarotDial = dynamic(() => import('./tarot-dial'), { ssr: false });

export default function Home() {
  return <TarotDial />;
}