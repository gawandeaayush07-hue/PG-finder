'use client';

import React from 'react';

export const HomepageSkeleton: React.FC = () => {
  return (
    <div aria-busy="true" aria-label="Loading student accommodations and campus stays" className="flex flex-col w-full relative overflow-hidden">
      {/* Ambient Glow Effect */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-secondary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
      
      {/* Announcement Skeleton Bar */}
      <div className="w-full bg-surface-container-low/70 backdrop-blur-sm py-2.5 px-margin-mobile md:px-gutter border-b border-outline-variant/30">
        <div className="max-w-max-width mx-auto flex items-center justify-center gap-3">
          <div className="w-20 h-4 bg-surface-container-highest rounded-full skeleton-shimmer"></div>
          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-outline-variant"></div>
          <div className="w-64 sm:w-96 h-4 bg-surface-container-high rounded-full skeleton-shimmer"></div>
        </div>
      </div>

      {/* Hero Skeleton Container */}
      <section className="w-full max-w-max-width mx-auto px-margin-mobile md:px-gutter pt-12 pb-16 flex flex-col items-center text-center">
        {/* Meta tag badge shimmer */}
        <div className="h-7 w-44 bg-surface-container-high rounded-full skeleton-shimmer mb-6"></div>
        
        {/* Dual-line Display Headline Skeleton */}
        <div className="w-full max-w-2xl flex flex-col items-center gap-3 mb-5">
          <div className="h-12 sm:h-14 w-11/12 sm:w-4/5 bg-surface-container-highest rounded-xl skeleton-shimmer"></div>
          <div className="h-12 sm:h-14 w-9/12 sm:w-3/5 bg-surface-container-high rounded-xl skeleton-shimmer"></div>
        </div>
        
        {/* Subtitle Skeleton */}
        <div className="w-full max-w-lg flex flex-col items-center gap-2 mb-12">
          <div className="h-4 w-full bg-surface-container rounded-full skeleton-shimmer"></div>
          <div className="h-4 w-3/4 bg-surface-container rounded-full skeleton-shimmer"></div>
        </div>

        {/* Main Floating Filter & Search Card Skeleton */}
        <div className="w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-8 shadow-level-2 flex flex-col gap-6 border border-outline-variant/40">
          {/* Sharing Type Chips Placeholder */}
          <div className="flex flex-wrap items-center gap-2.5 pb-2">
            <div className="w-24 h-8 bg-primary-fixed/60 rounded-full skeleton-shimmer"></div>
            <div className="w-28 h-8 bg-surface-container rounded-full skeleton-shimmer"></div>
            <div className="w-28 h-8 bg-surface-container rounded-full skeleton-shimmer"></div>
            <div className="w-32 h-8 bg-surface-container rounded-full skeleton-shimmer"></div>
            <div className="ml-auto hidden md:block w-20 h-5 bg-surface-container-high rounded-md skeleton-shimmer"></div>
          </div>

          {/* Controls Row: Campus Hub / Budget / Filter / CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            {/* Campus Selector Box */}
            <div className="bg-surface-container-low p-3.5 rounded-2xl flex items-center gap-3 border border-outline-variant/30">
              <div className="w-9 h-9 rounded-xl bg-surface-container-highest skeleton-shimmer shrink-0"></div>
              <div className="flex flex-col gap-1.5 w-full">
                <div className="w-16 h-3 bg-surface-container-highest rounded skeleton-shimmer"></div>
                <div className="w-28 h-4 bg-surface-container-high rounded skeleton-shimmer"></div>
              </div>
            </div>

            {/* Room Type Selector */}
            <div className="bg-surface-container-low p-3.5 rounded-2xl flex items-center gap-3 border border-outline-variant/30">
              <div className="w-9 h-9 rounded-xl bg-surface-container-highest skeleton-shimmer shrink-0"></div>
              <div className="flex flex-col gap-1.5 w-full">
                <div className="w-20 h-3 bg-surface-container-highest rounded skeleton-shimmer"></div>
                <div className="w-24 h-4 bg-surface-container-high rounded skeleton-shimmer"></div>
              </div>
            </div>

            {/* Budget Range Box */}
            <div className="bg-surface-container-low p-3.5 rounded-2xl flex items-center gap-3 border border-outline-variant/30">
              <div className="w-9 h-9 rounded-xl bg-surface-container-highest skeleton-shimmer shrink-0"></div>
              <div className="flex flex-col gap-1.5 w-full">
                <div className="w-14 h-3 bg-surface-container-highest rounded skeleton-shimmer"></div>
                <div className="w-24 h-4 bg-surface-container-high rounded skeleton-shimmer"></div>
              </div>
            </div>

            {/* Search Submit Action */}
            <div className="h-14 w-full bg-deep-green/80 rounded-2xl skeleton-shimmer flex items-center justify-center gap-2">
              <div className="w-5 h-5 rounded bg-white/30"></div>
              <div className="w-20 h-4 bg-white/30 rounded"></div>
            </div>
          </div>

          {/* Quick Micro Indicators Skeleton */}
          <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30">
            <div className="flex items-center gap-4">
              <div className="w-32 h-4 bg-surface-container rounded-full skeleton-shimmer"></div>
              <div className="w-28 h-4 bg-surface-container rounded-full skeleton-shimmer"></div>
            </div>
            <div className="w-36 h-4 bg-surface-container-high rounded-full skeleton-shimmer"></div>
          </div>
        </div>

        {/* Campus Filter Tags Row Skeleton */}
        <div className="w-full max-w-4xl mt-8 flex items-center justify-center gap-2.5 overflow-hidden">
          <div className="w-16 h-4 bg-surface-container-highest rounded skeleton-shimmer shrink-0 mr-2"></div>
          <div className="w-28 h-8 rounded-full bg-surface-container-high skeleton-shimmer shrink-0"></div>
          <div className="w-36 h-8 rounded-full bg-surface-container-high skeleton-shimmer shrink-0"></div>
          <div className="w-32 h-8 rounded-full bg-surface-container-high skeleton-shimmer shrink-0"></div>
          <div className="w-40 h-8 rounded-full bg-surface-container-high skeleton-shimmer shrink-0"></div>
          <div className="w-32 h-8 rounded-full bg-surface-container-high skeleton-shimmer shrink-0 hidden sm:block"></div>
          <div className="w-28 h-8 rounded-full bg-surface-container-high skeleton-shimmer shrink-0 hidden md:block"></div>
        </div>
      </section>

      {/* Featured Student Stays Grid Skeleton */}
      <section className="w-full max-w-max-width mx-auto px-margin-mobile md:px-gutter py-12">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div className="flex flex-col gap-2">
            <div className="w-32 h-4 bg-secondary-fixed-dim/60 rounded-full skeleton-shimmer"></div>
            <div className="w-72 sm:w-96 h-8 bg-surface-container-highest rounded-xl skeleton-shimmer"></div>
          </div>
          <div className="w-28 h-5 bg-surface-container-high rounded-md skeleton-shimmer"></div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-3xl overflow-hidden shadow-level-1 border border-outline-variant/40 flex flex-col">
              <div className="w-full aspect-[16/10] bg-surface-container-high skeleton-shimmer relative p-3 flex justify-between items-start">
                <div className="w-20 h-6 bg-white/80 backdrop-blur rounded-full"></div>
                <div className="w-8 h-8 bg-white/80 backdrop-blur rounded-full"></div>
              </div>
              <div className="p-5 flex flex-col flex-1 gap-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="w-40 h-5 bg-surface-container-highest rounded skeleton-shimmer"></div>
                  <div className="w-12 h-5 bg-secondary-container/60 rounded-md skeleton-shimmer shrink-0"></div>
                </div>
                <div className="w-36 h-3.5 bg-surface-container-high rounded skeleton-shimmer"></div>
                <div className="flex items-center gap-2 py-1">
                  <div className="w-6 h-6 rounded-md bg-surface-container-low skeleton-shimmer"></div>
                  <div className="w-6 h-6 rounded-md bg-surface-container-low skeleton-shimmer"></div>
                  <div className="w-6 h-6 rounded-md bg-surface-container-low skeleton-shimmer"></div>
                  <div className="w-12 h-4 rounded bg-surface-container-low skeleton-shimmer ml-1"></div>
                </div>
                <div className="mt-auto pt-3 flex items-center justify-between border-t border-outline-variant/30">
                  <div className="flex flex-col gap-1">
                    <div className="w-10 h-3 bg-surface-container rounded skeleton-shimmer"></div>
                    <div className="w-20 h-5 bg-surface-container-highest rounded skeleton-shimmer"></div>
                  </div>
                  <div className="w-24 h-9 bg-deep-green/20 rounded-xl skeleton-shimmer"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
