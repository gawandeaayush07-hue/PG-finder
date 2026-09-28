'use client';

import React from 'react';

export const SearchSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Global Hydration Live Status Header Pill */}
      <div className="w-full max-w-max-width mx-auto px-margin-mobile md:px-gutter pt-md pb-xs">
        <div className="flex items-center justify-between gap-md">
          <div className="flex items-center gap-sm bg-surface-container-high/80 px-md py-1.5 rounded-full border border-outline-variant/30">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-deep-green"></span>
            </span>
            <span className="font-label-sm text-xs text-on-surface-variant tracking-wide font-medium">
              Hydrating PG Engine &amp; Campus Stays...
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-on-surface-variant text-xs font-medium">
            <span className="material-symbols-outlined text-[16px] text-secondary">wifi_protected_setup</span>
            <span>Synchronizing live vacancies</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar Skeleton Module */}
      <section className="w-full max-w-max-width mx-auto px-margin-mobile md:px-gutter py-md">
        <div className="bg-white rounded-2xl p-md shadow-level-1 border border-outline-variant/40 flex flex-col gap-md">
          {/* Search Input Skeleton Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-md items-center">
            <div className="md:col-span-8 flex items-center gap-md bg-surface-container-low px-md py-sm rounded-xl">
              <div className="w-8 h-8 rounded-full bg-surface-container-high skeleton-shimmer shrink-0"></div>
              <div className="flex flex-col gap-1 flex-1">
                <div className="h-4 w-48 bg-surface-container-high rounded-full skeleton-shimmer"></div>
                <div className="h-3 w-32 bg-surface-container rounded-full skeleton-shimmer"></div>
              </div>
              <div className="hidden sm:block h-6 w-20 bg-surface-container-high rounded-full skeleton-shimmer"></div>
            </div>
            <div className="md:col-span-4 flex items-center justify-end gap-sm">
              <div className="h-11 flex-1 bg-surface-container-high rounded-xl skeleton-shimmer"></div>
              <div className="h-11 w-11 bg-deep-green/20 rounded-xl skeleton-shimmer shrink-0"></div>
            </div>
          </div>

          {/* Filter Pills Row Skeletons */}
          <div className="flex items-center gap-sm overflow-x-auto pb-xs pt-xs">
            <div className="h-8 w-28 bg-surface-container-high rounded-full skeleton-shimmer shrink-0"></div>
            <div className="h-8 w-44 bg-surface-container-high rounded-full skeleton-shimmer shrink-0"></div>
            <div className="h-8 w-32 bg-surface-container-high rounded-full skeleton-shimmer shrink-0"></div>
            <div className="h-8 w-28 bg-surface-container-high rounded-full skeleton-shimmer shrink-0"></div>
            <div className="h-8 w-32 bg-surface-container-high rounded-full skeleton-shimmer shrink-0"></div>
            <div className="h-8 w-36 bg-surface-container-high rounded-full skeleton-shimmer shrink-0"></div>
            <div className="h-8 w-24 bg-surface-container rounded-full skeleton-shimmer shrink-0"></div>
          </div>

          {/* Result Metabar Skeleton */}
          <div className="flex items-center justify-between pt-xs border-t border-outline-variant/30">
            <div className="flex items-center gap-sm">
              <div className="h-4 w-52 bg-surface-container-high rounded-full skeleton-shimmer"></div>
              <div className="h-4 w-16 bg-secondary-container/60 rounded-full skeleton-shimmer"></div>
            </div>
            <div className="flex items-center gap-md">
              <div className="hidden md:flex items-center gap-xs">
                <div className="h-3 w-16 bg-surface-container rounded-full skeleton-shimmer"></div>
                <div className="h-7 w-28 bg-surface-container-low rounded-lg skeleton-shimmer"></div>
              </div>
              <div className="h-7 w-20 bg-surface-container-low rounded-lg skeleton-shimmer"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual-Pane Split Layout (Listings | Map) */}
      <section className="w-full max-w-max-width mx-auto px-margin-mobile md:px-gutter pb-xl flex-1">
        <div className="flex flex-col lg:flex-row gap-lg items-start relative min-h-[700px]">
          {/* Left Pane: Listings Feed */}
          <div className="w-full lg:w-[58%] flex flex-col gap-lg">
            {[1, 2, 3].map((card) => (
              <article key={card} className="bg-white rounded-2xl p-md shadow-level-1 border border-outline-variant/40 flex flex-col sm:flex-row gap-md">
                <div className="sm:w-5/12 h-52 sm:h-auto rounded-xl bg-surface-container-high skeleton-shimmer relative flex flex-col justify-between p-sm min-h-[190px]">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-24 bg-white/80 rounded-full skeleton-shimmer"></div>
                    <div className="w-7 h-7 bg-white/80 rounded-full skeleton-shimmer"></div>
                  </div>
                  <div className="h-4 w-28 bg-white/70 rounded-full skeleton-shimmer self-start"></div>
                </div>
                <div className="sm:w-7/12 flex flex-col justify-between gap-sm pt-xs">
                  <div className="flex flex-col gap-xs">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-36 bg-secondary-fixed rounded-full skeleton-shimmer"></div>
                      <div className="h-4 w-12 bg-surface-container-high rounded-full skeleton-shimmer"></div>
                    </div>
                    <div className="h-6 w-11/12 bg-surface-container-highest rounded-full skeleton-shimmer mt-1"></div>
                    <div className="h-3 w-3/4 bg-surface-container rounded-full skeleton-shimmer"></div>
                  </div>
                  <div className="flex flex-wrap gap-xs my-xs">
                    <div className="h-6 w-20 bg-secondary-fixed/50 rounded-full skeleton-shimmer"></div>
                    <div className="h-6 w-24 bg-surface-container-low rounded-full skeleton-shimmer"></div>
                    <div className="h-6 w-16 bg-surface-container-low rounded-full skeleton-shimmer"></div>
                  </div>
                  <div className="flex items-center justify-between pt-xs border-t border-outline-variant/30">
                    <div className="flex flex-col gap-1">
                      <div className="h-6 w-28 bg-surface-container-high rounded-full skeleton-shimmer"></div>
                      <div className="h-3 w-16 bg-surface-container rounded-full skeleton-shimmer"></div>
                    </div>
                    <div className="h-9 w-28 bg-deep-green/20 rounded-xl skeleton-shimmer"></div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Right Pane: Map Skeleton */}
          <div className="w-full lg:w-[42%] sticky top-24 h-[650px] bg-white rounded-3xl p-4 shadow-level-1 border border-outline-variant/40 flex flex-col justify-between overflow-hidden">
            <div className="w-full h-full rounded-2xl bg-surface-container-low map-grid-bg relative flex flex-col justify-between p-4">
              <div className="flex justify-between items-center z-10">
                <div className="h-8 w-36 bg-white/90 rounded-full shadow-sm skeleton-shimmer"></div>
                <div className="h-8 w-10 bg-white/90 rounded-full shadow-sm skeleton-shimmer"></div>
              </div>
              
              {/* Pulsing Map Markers */}
              <div className="absolute top-1/3 left-1/4 w-8 h-8 rounded-full bg-deep-green/30 animate-ping"></div>
              <div className="absolute top-1/3 left-1/4 w-8 h-8 rounded-full bg-deep-green border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold">₹</div>
              
              <div className="absolute top-1/2 right-1/3 w-8 h-8 rounded-full bg-emerald-500/30 animate-ping"></div>
              <div className="absolute top-1/2 right-1/3 w-8 h-8 rounded-full bg-emerald-700 border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold">₹</div>
              
              <div className="z-10 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-sm flex items-center justify-between">
                <div className="h-4 w-40 bg-surface-container-highest rounded-full skeleton-shimmer"></div>
                <div className="h-6 w-20 bg-deep-green/20 rounded-lg skeleton-shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
