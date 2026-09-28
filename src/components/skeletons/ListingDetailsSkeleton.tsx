'use client';

import React from 'react';

export const ListingDetailsSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Floating Status Pill */}
      <div aria-busy="true" aria-live="polite" className="fixed bottom-6 right-6 z-40 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-level-2 border border-outline-variant flex items-center gap-2" role="status">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
        <span className="font-label-sm text-xs text-on-surface-variant tracking-wide uppercase font-semibold">Loading Property Details...</span>
      </div>

      <div className="w-full max-w-max-width mx-auto px-margin-mobile md:px-gutter py-md md:py-lg flex flex-col gap-lg">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 overflow-hidden py-1">
          <div className="h-4 w-12 rounded-lg bg-surface-container-highest skeleton-shimmer"></div>
          <span className="text-outline-variant font-label-sm text-xs select-none">/</span>
          <div className="h-4 w-24 rounded-lg bg-surface-container-highest skeleton-shimmer"></div>
          <span className="text-outline-variant font-label-sm text-xs select-none">/</span>
          <div className="h-4 w-36 rounded-lg bg-surface-container-highest skeleton-shimmer"></div>
        </div>

        {/* Title & Actions Row Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-md">
          <div className="flex flex-col gap-sm">
            <div className="flex items-center gap-sm flex-wrap">
              <div className="h-6 w-28 rounded-full bg-secondary-container skeleton-shimmer"></div>
              <div className="h-6 w-20 rounded-full bg-surface-container-high skeleton-shimmer"></div>
              <div className="h-6 w-32 rounded-full bg-surface-container skeleton-shimmer"></div>
            </div>
            <div className="h-9 md:h-10 w-3/4 max-w-xl rounded-xl bg-surface-container-highest skeleton-shimmer"></div>
            <div className="flex items-center gap-md flex-wrap">
              <div className="h-5 w-64 rounded-lg bg-surface-container-high skeleton-shimmer"></div>
              <div className="h-4 w-32 rounded-lg bg-surface-container skeleton-shimmer"></div>
            </div>
          </div>
          <div className="flex items-center gap-sm self-start lg:self-center">
            <div className="h-11 w-11 rounded-xl bg-white shadow-sm border border-outline-variant/40 flex items-center justify-center">
              <div className="h-5 w-5 rounded-md bg-surface-container-highest skeleton-shimmer"></div>
            </div>
            <div className="h-11 w-11 rounded-xl bg-white shadow-sm border border-outline-variant/40 flex items-center justify-center">
              <div className="h-5 w-5 rounded-md bg-surface-container-highest skeleton-shimmer"></div>
            </div>
            <div className="h-11 w-36 rounded-xl bg-surface-container-highest skeleton-shimmer"></div>
          </div>
        </div>

        {/* Gallery Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-md h-auto lg:h-[480px]">
          <div className="lg:col-span-8 h-72 sm:h-96 lg:h-full rounded-2xl bg-surface-container-high relative overflow-hidden flex flex-col justify-between p-lg skeleton-shimmer">
            <div className="relative z-10 flex justify-between items-start">
              <div className="h-7 w-32 rounded-full bg-white/80 backdrop-blur-sm shadow-sm"></div>
              <div className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm"></div>
            </div>
            <div className="relative z-10 flex gap-sm">
              <div className="h-6 w-24 rounded-lg bg-white/70 backdrop-blur-sm"></div>
              <div className="h-6 w-20 rounded-lg bg-white/70 backdrop-blur-sm"></div>
            </div>
          </div>
          <div className="lg:col-span-4 grid grid-cols-2 gap-md h-72 sm:h-96 lg:h-full">
            <div className="rounded-xl bg-surface-container-high skeleton-shimmer"></div>
            <div className="rounded-xl bg-surface-container-high skeleton-shimmer"></div>
            <div className="rounded-xl bg-surface-container-high skeleton-shimmer"></div>
            <div className="rounded-xl bg-surface-container-high skeleton-shimmer flex items-center justify-center">
              <div className="flex flex-col items-center gap-xs">
                <div className="h-5 w-5 rounded-full bg-white/60"></div>
                <div className="h-4 w-16 rounded-md bg-white/60"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Split Content: Overview & Booking Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start mt-sm">
          {/* Main Info */}
          <div className="lg:col-span-8 flex flex-col gap-lg">
            {/* Owner Details Card Skeleton */}
            <div className="bg-white rounded-2xl p-lg shadow-level-1 border border-outline-variant/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-md">
              <div className="flex items-center gap-md">
                <div className="w-16 h-16 rounded-full bg-surface-container-highest skeleton-shimmer shrink-0"></div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-sm">
                    <div className="h-5 w-36 rounded-lg bg-surface-container-highest skeleton-shimmer"></div>
                    <div className="h-4 w-20 rounded-full bg-secondary-container skeleton-shimmer"></div>
                  </div>
                  <div className="h-4 w-48 rounded-lg bg-surface-container skeleton-shimmer"></div>
                  <div className="h-3 w-32 rounded-lg bg-surface-container-high skeleton-shimmer"></div>
                </div>
              </div>
              <div className="flex items-center gap-sm w-full sm:w-auto">
                <div className="h-10 w-28 rounded-xl bg-surface-container-high skeleton-shimmer"></div>
                <div className="h-10 w-28 rounded-xl bg-surface-container skeleton-shimmer"></div>
              </div>
            </div>

            {/* Room Options Skeleton */}
            <div className="bg-white rounded-2xl p-lg shadow-level-1 border border-outline-variant/40 flex flex-col gap-md">
              <div className="flex items-center justify-between">
                <div className="h-6 w-44 rounded-lg bg-surface-container-highest skeleton-shimmer"></div>
                <div className="h-4 w-24 rounded-lg bg-surface-container skeleton-shimmer"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-md pt-sm">
                {[1, 2, 3].map((room) => (
                  <div key={room} className="bg-surface-container-low rounded-xl p-md flex flex-col gap-1.5 border border-outline-variant/30">
                    <div className="h-3 w-16 rounded-md bg-surface-container-highest skeleton-shimmer"></div>
                    <div className="h-5 w-24 rounded-md bg-surface-container-high skeleton-shimmer"></div>
                    <div className="h-3 w-12 rounded-md bg-surface-container skeleton-shimmer"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Grid Skeleton */}
            <div className="bg-white rounded-2xl p-lg shadow-level-1 border border-outline-variant/40 flex flex-col gap-md">
              <div className="h-6 w-48 rounded-lg bg-surface-container-highest skeleton-shimmer"></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((a) => (
                  <div key={a} className="flex items-center gap-2 p-2 rounded-xl bg-surface-container-low">
                    <div className="w-6 h-6 rounded-md bg-surface-container-high skeleton-shimmer shrink-0"></div>
                    <div className="h-4 w-20 rounded bg-surface-container-highest skeleton-shimmer"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card Skeleton (Sticky Sidebar) */}
          <div className="lg:col-span-4 sticky top-24 bg-white rounded-3xl p-6 shadow-level-2 border border-outline-variant/40 flex flex-col gap-5">
            <div className="flex justify-between items-center pb-3 border-b border-outline-variant/30">
              <div className="flex flex-col gap-1">
                <div className="h-4 w-16 bg-surface-container rounded skeleton-shimmer"></div>
                <div className="h-8 w-28 bg-surface-container-highest rounded skeleton-shimmer"></div>
              </div>
              <div className="h-6 w-20 bg-emerald-100 rounded-full skeleton-shimmer"></div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="h-4 w-24 bg-surface-container rounded skeleton-shimmer"></div>
              <div className="h-12 w-full bg-surface-container-low rounded-xl skeleton-shimmer border border-outline-variant/30"></div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="h-4 w-24 bg-surface-container rounded skeleton-shimmer"></div>
              <div className="h-12 w-full bg-surface-container-low rounded-xl skeleton-shimmer border border-outline-variant/30"></div>
            </div>

            <div className="h-12 w-full bg-deep-green/80 rounded-xl skeleton-shimmer mt-2"></div>
            <div className="h-4 w-3/4 mx-auto bg-surface-container rounded skeleton-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
