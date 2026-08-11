'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reveal animation on mount (page entering)
    const ctx = gsap.context(() => {
      // The wipe overlay slides down and reveals the content
      gsap.fromTo(wipeRef.current, 
        { scaleY: 1, transformOrigin: 'top' },
        { scaleY: 0, duration: 1, ease: 'power4.inOut' }
      );
      
      // Content fades and slides in
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Wipe Overlay */}
      <div 
        ref={wipeRef} 
        className="fixed inset-0 bg-brand-green z-[9990] pointer-events-none"
      />
      {/* Page Content */}
      <div ref={containerRef}>
        {children}
      </div>
    </>
  );
}
