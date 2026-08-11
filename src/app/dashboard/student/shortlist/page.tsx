'use client';

import React from 'react';
import { usePersona } from '@/context/PersonaContext';
import Link from 'next/link';

export default function StudentShortlist() {
  const { listings, shortlist, toggleShortlist } = usePersona();

  // Find shortlisted properties
  const shortlistedListings = listings.filter((l) => shortlist.includes(l.id));

  return (
    <div className="bg-white rounded-card p-6 shadow-level-1 border border-outline-variant flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-primary">Shortlisted Accommodation</h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Compare your saved properties and schedule visits to find your favorite.
        </p>
      </div>

      {shortlistedListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shortlistedListings.map((listing) => (
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
        <div className="text-center py-12 flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-5xl text-outline-variant" style={{ fontVariationSettings: "'FILL' 0" }}>favorite_border</span>
          <p className="text-sm text-on-surface-variant">Your shortlist is empty. Start exploring properties to save your favorites!</p>
          <Link href="/search" className="bg-deep-green text-on-primary text-xs font-bold px-6 py-2.5 rounded-full mt-2 cursor-pointer">
            Explore PGs
          </Link>
        </div>
      )}
    </div>
  );
}
