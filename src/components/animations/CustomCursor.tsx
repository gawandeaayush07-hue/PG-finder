'use client';

import React, { useEffect } from 'react';
import gsap from 'gsap';

export function CustomCursor() {
  useEffect(() => {
    // We removed the custom circle cursor and cursor-none styling.
    // The magnetic logic is handled separately in Magnetic.tsx.
    return () => {};
  }, []);

  return null;
}
