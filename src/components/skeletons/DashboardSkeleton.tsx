'use client';

import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-max-width mx-auto px-margin-mobile md:px-gutter py-md md:py-lg flex flex-col gap-lg min-h-screen">
      {/* Top Header Banner Skeleton */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-level-1 border border-outline-variant/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-surface-container-high skeleton-shimmer shrink-0 border-2 border-emerald-100"></div>
          <div className="flex flex-col gap-2">
            <div className="h-6 w-48 bg-surface-container-highest rounded skeleton-shimmer"></div>
            <div className="h-4 w-32 bg-surface-container rounded skeleton-shimmer"></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-28 rounded-full bg-surface-container-high skeleton-shimmer"></div>
          <div className="h-10 w-32 rounded-full bg-deep-green/20 skeleton-shimmer"></div>
        </div>
      </div>

      {/* Stats Counter Bar Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 shadow-level-1 border border-outline-variant/40 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-surface-container-low skeleton-shimmer"></div>
            <div className="h-7 w-20 bg-surface-container-highest rounded skeleton-shimmer mt-2"></div>
            <div className="h-3 w-28 bg-surface-container rounded skeleton-shimmer"></div>
          </div>
        ))}
      </div>

      {/* Main Grid: Left Activity / Right Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-level-1 border border-outline-variant/40 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2 border-b border-outline-variant/30">
              <div className="h-6 w-40 bg-surface-container-highest rounded skeleton-shimmer"></div>
              <div className="h-4 w-20 bg-surface-container rounded skeleton-shimmer"></div>
            </div>

            {/* List Item Skeletons */}
            {[1, 2, 3].map((row) => (
              <div key={row} className="p-4 rounded-2xl bg-surface-container-low/60 border border-outline-variant/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high skeleton-shimmer shrink-0"></div>
                  <div className="flex flex-col gap-1.5">
                    <div className="h-4 w-36 bg-surface-container-highest rounded skeleton-shimmer"></div>
                    <div className="h-3 w-24 bg-surface-container rounded skeleton-shimmer"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-20 rounded-full bg-emerald-100 skeleton-shimmer"></div>
                  <div className="h-8 w-24 rounded-lg bg-deep-green/20 skeleton-shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-level-1 border border-outline-variant/40 flex flex-col gap-4">
            <div className="h-6 w-32 bg-surface-container-highest rounded skeleton-shimmer pb-2"></div>
            <div className="h-28 w-full bg-surface-container-low rounded-2xl skeleton-shimmer border border-outline-variant/30"></div>
            <div className="h-10 w-full bg-deep-green/20 rounded-xl skeleton-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
