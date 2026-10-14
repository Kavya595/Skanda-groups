import React from 'react';
import { useScrollProgress } from '../hooks/useScrollSpy';

export default function ScrollProgress() {
  const { scrollProgress } = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 transition-all duration-75 ease-out shadow-[0_0_12px_rgba(241,90,36,0.6)]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
