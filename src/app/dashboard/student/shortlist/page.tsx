'use client';

import React, { useState, useEffect } from 'react';
import { usePersona } from '@/context/PersonaContext';
import type { Listing } from '@/context/PersonaContext';
import { getListingsByIds } from '@/lib/listings-actions';
import Link from 'next/link';

export default function StudentShortlist() {
  const { listings, shortlist, toggleShortlist, user, isLoadingAuth } = usePersona();
  const [shortlistedListings, setShortlistedListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isPlaceholderMode =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.includes('placeholder');

  const isDemo = process.env.NODE_ENV === 'development' && isPlaceholderMode && !user;

  // Real user: filter out mock seed shortlist
  const effectiveShortlist = isDemo
    ? shortlist
    : shortlist.filter((id) => id !== 'listing-2' || !isPlaceholderMode);

  useEffect(() => {
    let isMounted = true;

    async function loadShortlisted() {
      if (effectiveShortlist.length === 0) {
        setShortlistedListings([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getListingsByIds(effectiveShortlist);
        if (!isMounted) return;

        if (data && data.length > 0) {
          setShortlistedListings(data);
        } else if (isDemo) {
          // Dev demo fallback for mock listing IDs
          setShortlistedListings(listings.filter((l) => effectiveShortlist.includes(l.id)));
        } else {
          setShortlistedListings([]);
        }
      } catch (err) {
        console.error('Error fetching shortlisted listings:', err);
        if (isMounted) {
          if (isDemo) {
            setShortlistedListings(listings.filter((l) => effectiveShortlist.includes(l.id)));
          } else {
            setShortlistedListings([]);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (!isLoadingAuth) {
      loadShortlisted();
    }
  }, [effectiveShortlist.join(','), isLoadingAuth, isDemo]);

  // Filter visible listings by effectiveShortlist for optimistic deletion feedback
  const displayedListings = shortlistedListings.filter((l) => effectiveShortlist.includes(l.id));

  return (
    <div className="bg-white rounded-card p-6 shadow-level-1 border border-outline-variant flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-primary">Shortlisted Accommodation</h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Compare your saved properties and schedule visits to find your favorite.
        </p>
      </div>

      {isLoadingAuth || (isLoading && displayedListings.length === 0 && effectiveShortlist.length > 0) ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-deep-green border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-on-surface-variant font-medium">Loading your shortlisted PGs...</p>
        </div>
      ) : displayedListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedListings.map((listing) => (
            <div 
              key={listing.id}
              className="border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow relative bg-white"
            >
              <div className="relative h-40 w-full">
                <img 
                  src={listing.image} 
                  alt={listing.title} 
                  className="w-full h-full object-cover"
                />
                
                {/* Remove heart button */}
                <button
                  onClick={() => toggleShortlist(listing.id)}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center text-rose-500 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    favorite
                  </span>
                </button>

                <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-bold text-primary shadow-sm flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[13px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  {listing.rating}
                </div>
              </div>

              <div className="p-4 flex-grow flex flex-col gap-3">
                <div>
                  <span className="text-[9px] font-bold tracking-wider text-deep-green uppercase bg-light-sage/30 px-1.5 py-0.5 rounded">
                    {listing.type} PG
                  </span>
                  <h3 className="font-bold text-primary text-sm mt-1 line-clamp-1">{listing.title}</h3>
                  <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {listing.location} ({listing.distanceText})
                  </p>
                </div>

                <div className="mt-auto border-t border-outline-variant pt-3 flex items-center justify-between">
                  <span className="font-bold text-primary text-sm">
                    ₹{listing.price.toLocaleString()}
                    <span className="text-[10px] text-on-surface-variant font-normal">/mo</span>
                  </span>
                  <Link 
                    href={`/listings/${listing.id}`}
                    className="bg-deep-green text-on-primary hover:bg-primary text-xs font-semibold px-3 py-1.5 rounded-md cursor-pointer"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-outline-variant" style={{ fontVariationSettings: "'FILL' 0" }}>favorite_border</span>
          <p className="text-sm font-medium text-on-surface-variant">No shortlisted PGs yet</p>
          <p className="text-xs text-on-surface-variant max-w-sm">
            Your shortlist is empty. Start exploring properties to save your favorites!
          </p>
          <Link
            href="/search"
            className="bg-deep-green hover:bg-primary text-on-primary px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer mt-1"
          >
            Explore PGs
          </Link>
        </div>
      )}
    </div>
  );
}
