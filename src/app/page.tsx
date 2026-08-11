'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { usePersona } from '@/context/PersonaContext';
import Link from 'next/link';

export default function Home() {
  const { listings, searchQuery, setSearchQuery, priceRange, setPriceRange } = usePersona();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/search');
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] md:w-[40vw] md:h-[40vw] bg-light-sage rounded-full blur-[120px] opacity-40 -z-10 translate-x-1/4 -translate-y-1/4"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-6 z-10 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <span className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white px-4 py-1.5 rounded-full w-max text-sm font-medium text-deep-green shadow-sm">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                Verified Listings Only
              </span>
              <h1 className="font-display-lg text-display-lg text-deep-green leading-tight font-bold">
                Find the Perfect PG Near Your College
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[45ch]">
                Search by distance, price, and amenities — verified listings, no brokers. A tranquil home for your student journey.
              </p>
            </div>

            {/* Search Bar Component */}
            <form onSubmit={handleSearch} className="glass-panel p-3 rounded-2xl shadow-level-2 mt-4 flex flex-col md:flex-row gap-3 relative max-w-[600px]">
              <div className="relative flex-1">
                <label className="sr-only" htmlFor="college-search">Select College</label>
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline-variant text-[20px]">school</span>
                </div>
                <input
                  type="text"
                  id="college-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 bg-white border border-[#B8D9B0] input-radius text-on-surface placeholder:text-outline-variant focus:border-deep-green focus:border-2 focus:ring-0 transition-all font-body-md"
                  placeholder="Select College or Area..."
                />
              </div>
              <div className="relative flex-1 md:max-w-[180px]">
                <label className="sr-only" htmlFor="price-range">Price Range</label>
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline-variant text-[20px]">payments</span>
                </div>
                <select
                  id="price-range"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full h-12 pl-10 pr-10 bg-white border border-[#B8D9B0] input-radius text-on-surface focus:border-deep-green focus:border-2 focus:ring-0 transition-all font-body-md appearance-none cursor-pointer"
                >
                  <option value="">Price Range</option>
                  <option value="low">Under ₹7,000</option>
                  <option value="mid">₹7,000 - ₹10,000</option>
                  <option value="high">Above ₹10,000</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline-variant text-[20px]">expand_more</span>
                </div>
              </div>
              <button
                type="submit"
                className="bg-deep-green text-on-primary h-12 px-6 btn-radius hover:bg-primary transition-colors flex items-center justify-center gap-2 font-label-md text-label-md shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">search</span>
                Search PGs
              </button>
            </form>
          </div>

          {/* Right Content: Image Composition */}
          <div className="lg:col-span-6 relative h-[500px] lg:h-[600px] hidden lg:block">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4/5 h-[110%] bg-light-sage rounded-[60px] rounded-br-[120px] -z-10 transform -rotate-3"></div>
            {/* Top Image Card */}
            <div className="absolute top-10 right-10 w-3/4 h-[300px] bg-white rounded-3xl shadow-level-2 p-3 transform rotate-2 hover:rotate-0 transition-transform duration-500 overflow-hidden">
              <img
                className="w-full h-full object-cover rounded-2xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBww10ZNK22CqL1MKpLilSEPmeFJIVw9ezy4Hz5PIQ0v7iZKKUwKVd-JwHNJ7L1vERXYod-a6gima6xDCefXNwYoZzKUK3BgdkxR2jP53nBvoPK9gBJvC8BKzDGVo9yPrryFW1gSp8YGrTkkxLVbGdsfvhhcp8SjNvU-ZuvwbX6gZZCdzli0QPqzFzGeppIWthUYjqlrJEEzN_We4gkkt8ttCe1FV8Jvh7UhEWK7UPI2UT0nooWRwDE"
                alt="Modern student housing room"
              />
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-green-600 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="font-label-sm text-label-sm text-deep-green font-semibold">Available Now</span>
              </div>
            </div>
            {/* Bottom Image Card */}
            <div className="absolute bottom-10 left-0 w-2/3 h-[250px] bg-white rounded-3xl shadow-level-2 p-3 transform -rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden">
              <img
                className="w-full h-full object-cover rounded-2xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_4ybjU8pDatqwKDFx7yva0oyA8eEKSKVdYNvbkXDSa1eUFNIGSANy90ZGVdumrxBDn55S4wcAUmYWWG7vUMk-O-h4ZnsSXfrCAPzpYw5GRGQr4YNBz9fX4lqfMuh-d9ijYnf1yqIg8qtZH-SV5b2vSydtxKABuBeXQakcn4p4Z7871PSbdTERPy6KuZ_xOjEoUxQkQrQbmNQPk_i4CJ9QNutMfcNy68Y5l8AA6XVs5J34TyceWBrR"
                alt="Communal study area"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bento-grid Description Section */}
      <section className="py-16 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-headline-lg text-deep-green mb-4 font-bold">How It Works</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[50ch] mx-auto">
            Find your next home in three simple steps, designed to be completely stress-free.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 card-radius shadow-level-1 hover-lift text-center flex flex-col items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-light-sage/20 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="w-16 h-16 rounded-full bg-light-sage flex items-center justify-center text-deep-green mb-2">
              <span className="material-symbols-outlined text-[32px]">location_on</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-deep-green font-semibold">Search Nearby PGs</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Enter your college or desired area to instantly discover verified properties nearby.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 card-radius shadow-level-1 hover-lift text-center flex flex-col items-center gap-4 relative overflow-hidden group md:translate-y-8">
            <div className="absolute top-0 right-0 w-24 h-24 bg-light-sage/20 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="w-16 h-16 rounded-full bg-light-sage flex items-center justify-center text-deep-green mb-2">
              <span className="material-symbols-outlined text-[32px]">compare_arrows</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-deep-green font-semibold">Compare &amp; Shortlist</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Review amenities, real photos, and transparent pricing to find your perfect match.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 card-radius shadow-level-1 hover-lift text-center flex flex-col items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-light-sage/20 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="w-16 h-16 rounded-full bg-light-sage flex items-center justify-center text-deep-green mb-2">
              <span className="material-symbols-outlined text-[32px]">event_available</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-deep-green font-semibold">Book a Visit</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Schedule a tour directly through the platform. No brokers, no hidden fees.
            </p>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="w-full h-xl"></div>

      {/* Featured PGs Section */}
      <section className="py-16 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-deep-green mb-2 font-bold">Featured Properties</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Handpicked, highly-rated accommodations near top campuses.
            </p>
          </div>
          <Link href="/search" className="flex items-center gap-2 text-deep-green font-label-md text-label-md hover:underline font-semibold group">
            View all listings
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {listings.slice(0, 3).map((listing) => (
            <div key={listing.id} className="bg-white card-radius shadow-level-1 hover-lift flex flex-col overflow-hidden">
              <div className="relative h-56 w-full p-2">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover rounded-t-[20px] rounded-b-lg"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                  <span className="font-label-sm text-label-sm text-deep-green font-bold">₹{listing.price.toLocaleString()}/mo</span>
                </div>
                {listing.premium && (
                  <div className="absolute top-4 left-4 bg-deep-green text-white px-3 py-1 rounded-full shadow-sm">
                    <span className="font-label-sm text-label-sm">Premium</span>
                  </div>
                )}
              </div>
              
              <div className="p-6 flex flex-col flex-grow gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-headline-md text-headline-md text-deep-green font-semibold line-clamp-1">
                      {listing.title}
                    </h3>
                    <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-sm font-bold text-on-surface">{listing.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    <span className="text-sm">{listing.location}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  <span className="bg-light-sage text-deep-green font-label-sm text-label-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">directions_walk</span>
                    {listing.distanceText}
                  </span>
                  <span className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm px-3 py-1 rounded-full border border-outline-variant">
                    {listing.type} PG
                  </span>
                </div>

                <Link
                  href={`/listings/${listing.id}`}
                  className="w-full text-center mt-2 py-3 border-2 border-deep-green text-deep-green font-label-md text-label-md btn-radius hover:bg-light-sage/30 transition-colors font-semibold"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
