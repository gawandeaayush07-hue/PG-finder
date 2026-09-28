'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Fake loading progress
    tl.to(progressRef.current, {
      width: '100%',
      duration: 2,
      ease: 'power2.inOut',
    })
    .to(textRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
    }, "+=0.2")
    // Wipe transition out
    .to(containerRef.current, {
      yPercent: -100,
      duration: 1,
      ease: 'power4.inOut',
      onComplete: () => setIsLoading(false)
    });

  }, []);

  if (!isLoading) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-brand-green text-white"
    >
      <div className="overflow-hidden">
        <h1 ref={textRef} className="text-5xl md:text-7xl font-bold mb-4 font-heading tracking-tight text-black">
          PGFinder
        </h1>
      </div>
      <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
        <div ref={progressRef} className="h-full w-0 bg-white" />
      </div>
    </div>
  );
}
