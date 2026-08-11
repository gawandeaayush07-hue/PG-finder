'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePersona } from '@/context/PersonaContext';

export default function SearchResults() {
  const { role, listings, shortlist, toggleShortlist, searchQuery, setSearchQuery } = usePersona();
  
  // Local filter states
  const [maxDistance, setMaxDistance] = useState<number>(10); // in km
  const [maxPrice, setMaxPrice] = useState<number>(20000); // in INR
  const [genderTypes, setGenderTypes] = useState<{ [key: string]: boolean }>({
    Boys: true,
    Girls: true,
    'Co-ed': true,
  });
  const [sortBy, setSortBy] = useState<string>('Recommended');

  // Parse distance text helper (e.g. "5 mins walk to college" -> 0.5km, "15 mins bus ride" -> 3.0km)
  const getMockDistance = (distanceText: string): number => {
    if (distanceText.includes('5 mins')) return 0.5;
    if (distanceText.includes('10 mins')) return 1.0;
    if (distanceText.includes('15 mins')) return 3.0;
    return 2.5;
  };

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        // 1. Text Search (title or location)
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchesText =
            item.title.toLowerCase().includes(q) ||
            item.location.toLowerCase().includes(q);
          if (!matchesText) return false;
        }

        // 2. Distance filter
        const km = getMockDistance(item.distanceText);
        if (km > maxDistance) return false;

        // 3. Price filter
        if (item.price > maxPrice) return false;

        // 4. Gender Type filter
        if (!genderTypes[item.type]) return false;

        // 5. Guest restriction (Hide premium listings from Guests)
        if (role === 'GUEST' && item.premium) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'Price: Low to High') return a.price - b.price;
        if (sortBy === 'Rating') return b.rating - a.rating;
        if (sortBy === 'Distance') return getMockDistance(a.distanceText) - getMockDistance(b.distanceText);
        return 0; // Recommended / default
      });
  }, [listings, searchQuery, maxDistance, maxPrice, genderTypes, sortBy]);

  const handleGenderToggle = (type: string) => {
    setGenderTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className="w-full max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      
      {/* Sidebar Filters */}
      <aside className="lg:col-span-3">
        <div className="bg-white rounded-2xl p-lg shadow-level-1 sticky top-24 border border-outline-variant">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline-md text-headline-md text-primary font-bold">Filters</h2>
            <span className="material-symbols-outlined text-primary">tune</span>
          </div>

          <div className="space-y-6">
            {/* College search input */}
            <div>
              <label className="font-label-md text-label-md text-on-surface block mb-2 font-semibold">Location / College</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-[#B8D9B0] rounded-lg text-sm focus:border-deep-green focus:ring-0 outline-none"
                  placeholder="Enter area or college..."
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-primary text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Distance range */}
            <div>
              <label className="font-label-md text-label-md text-on-surface block mb-2 font-semibold">
                Max Distance: {maxDistance} km
              </label>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={maxDistance}
                onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-label-sm text-on-surface-variant mt-1">
                <span>0.5 km</span>
                <span>10 km</span>
              </div>
            </div>

            {/* Price range */}
            <div>
              <label className="font-label-md text-label-md text-on-surface block mb-2 font-semibold">
                Max Price: ₹{maxPrice.toLocaleString()}
              </label>
              <input
                type="range"
                min="3000"
                max="25000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-label-sm text-on-surface-variant mt-1">
                <span>₹3,000</span>
                <span>₹25,000+</span>
              </div>
            </div>

            {/* Room Type / Gender */}
            <div>
              <label className="font-label-md text-label-md text-on-surface block mb-3 font-semibold">PG Type</label>
              <div className="space-y-2">
                {['Boys', 'Girls', 'Co-ed'].map((t) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={genderTypes[t]}
                      onChange={() => handleGenderToggle(t)}
                      className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                    <span className="font-body-md text-body-md text-sm text-on-surface-variant group-hover:text-primary transition-colors">
                      {t} PG
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              onClick={() => {
                setMaxDistance(10);
                setMaxPrice(20000);
                setGenderTypes({ Boys: true, Girls: true, 'Co-ed': true });
                setSearchQuery('');
              }}
              className="w-full text-center text-xs font-semibold text-deep-green hover:underline mt-4 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </aside>

      {/* Main Listings Column */}
      <section className="lg:col-span-9">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold">
              {filteredListings.length} PG{filteredListings.length === 1 ? '' : 's'} Found {searchQuery && `near "${searchQuery}"`}
            </h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Showing verified, broker-free hostels and student rooms.
            </p>
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-[#B8D9B0] rounded-lg px-4 py-2 pr-10 font-label-md text-label-md text-on-surface w-full focus:ring-2 focus:ring-primary outline-none cursor-pointer"
            >
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Distance</option>
              <option>Rating</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {filteredListings.map((listing, index) => {
              const isSaved = shortlist.includes(listing.id);
              return (
                <div 
                  key={listing.id} 
                  className="bg-white rounded-2xl overflow-hidden shadow-level-1 flex flex-col group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border border-outline-variant relative animate-pop-up opacity-0"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-48 w-full">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-full object-cover rounded-t-2xl"
                    />
                    
                    {/* Verified stamp */}
                    {listing.verified && (
                      <div className="absolute top-3 left-3 bg-deep-green text-white px-2.5 py-1 rounded-md flex items-center gap-1 font-label-sm text-[11px] shadow-sm font-semibold">
                        <span className="material-symbols-outlined text-[14px]">verified</span> 
                        Verified
                      </div>
                    )}

                    {/* Shortlist heart button */}
                    <button
                      onClick={() => toggleShortlist(listing.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm cursor-pointer transition-colors text-rose-500"
                    >
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: ` 'FILL' ${isSaved ? 1 : 0}` }}>
                        favorite
                      </span>
                    </button>

                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-0.5 font-label-sm text-sm text-primary shadow-sm font-semibold">
                      <span className="material-symbols-outlined text-[14px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 
                      {listing.rating}
                    </div>
                  </div>

                  <div className="p-4 flex-grow flex flex-col gap-3">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider text-deep-green uppercase bg-light-sage/30 px-2 py-0.5 rounded">
                        {listing.type} PG
                      </span>
                      <h3 className="font-headline-md text-[18px] leading-snug text-primary font-bold mt-1.5 line-clamp-1">
                        {listing.title}
                      </h3>
                      <div className="flex items-center text-on-surface-variant font-body-md text-xs gap-1 mt-1">
                        <span className="material-symbols-outlined text-[15px]">location_on</span> 
                        {listing.location} ({listing.distanceText})
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 my-1">
                      {listing.amenities.slice(0, 3).map((amenity) => (
                        <span key={amenity} className="bg-surface-container text-on-surface-variant px-2 py-0.5 rounded text-[10px]">
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-outline-variant pt-3">
                      <div>
                        <span className="text-[11px] text-on-surface-variant block leading-none">Starting from</span>
                        <span className="font-headline-md text-lg text-primary font-bold">
                          ₹{listing.price.toLocaleString()}
                          <span className="text-xs font-normal text-on-surface-variant">/mo</span>
                        </span>
                      </div>
                      <Link
                        href={`/listings/${listing.id}`}
                        className="bg-deep-green text-on-primary hover:bg-primary px-4 py-2 rounded-lg font-label-md text-xs font-bold transition-colors cursor-pointer"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-level-1 border border-outline-variant flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-6xl text-outline-variant">search_off</span>
            <h3 className="font-headline-md text-deep-green font-bold text-xl">No Properties Found</h3>
            <p className="text-on-surface-variant max-w-[40ch]">
              We couldn't find any PGs matching your filters. Try clearing your search query or expanding your distance/price ranges.
            </p>
            <button
              onClick={() => {
                setMaxDistance(10);
                setMaxPrice(20000);
                setGenderTypes({ Boys: true, Girls: true, 'Co-ed': true });
                setSearchQuery('');
              }}
              className="bg-deep-green text-on-primary px-6 py-2 rounded-lg text-sm font-semibold hover:bg-primary transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
