'use client';

import React, { useState } from 'react';
import { usePersona, Listing } from '@/context/PersonaContext';

export default function OwnerListings() {
  const { listings, setListings, user, profile } = usePersona();

  const isPlaceholderMode =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.includes('placeholder');

  const isDemo = process.env.NODE_ENV === 'development' && isPlaceholderMode && !user;

  // Real user: filter out mock seed listings
  const ownerListings = isDemo
    ? listings
    : listings.filter((l) => l.id !== 'listing-1' && l.id !== 'listing-2' && l.id !== 'listing-3');

  // Form toggle
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState<'Boys' | 'Girls' | 'Co-ed'>('Boys');
  const [distanceText, setDistanceText] = useState('5 mins walk to college');
  const [description, setDescription] = useState('');
  
  const [amenities, setAmenities] = useState<{ [key: string]: boolean }>({
    Wifi: true,
    AC: false,
    Laundry: false,
    Gym: false,
    'Food Included': true,
    CCTV: false,
    Security: false,
  });

  const handleAmenityChange = (name: string) => {
    setAmenities((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !price) return;

    const selectedAmenities = Object.keys(amenities).filter((k) => amenities[k]);

    const newListing: Listing = {
      id: `listing-${Date.now()}`,
      title,
      location,
      price: parseInt(price),
      rating: 5.0,
      reviewsCount: 0,
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&h=300&q=80',
      images: [
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&h=300&q=80',
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=400&h=300&q=80'
      ],
      distanceText,
      type,
      premium: false,
      verified: false, // Must be approved by admin pipeline
      amenities: selectedAmenities,
      rooms: [
        { name: 'Double Sharing', price: parseInt(price), available: true }
      ],
      owner: {
        name:
          profile?.full_name?.trim() ||
          (user?.user_metadata?.full_name as string)?.trim() ||
          (user?.email ? user.email.split('@')[0] : '') ||
          (isDemo ? 'Mrs. Sunita Gupta' : 'Property Owner'),
        phone: profile?.phone || (user?.user_metadata?.phone as string) || (isDemo ? '+91 99999 88888' : ''),
        email: user?.email || profile?.email || (isDemo ? 'sunita@pgfinder.com' : ''),
        avatar: profile?.avatar_url || (isDemo ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80' : '')
      },
      description,
      reviews: []
    };

    setListings((prev) => [...prev, newListing]);
    setSuccessMsg('Property listed successfully! It will go live after admin verification.');
    
    // Reset states
    setTitle('');
    setLocation('');
    setPrice('');
    setDescription('');
    setShowAddForm(false);

    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white rounded-card p-6 shadow-level-1 border border-outline-variant">
        <div>
          <h1 className="text-xl font-bold text-primary">Manage Listings</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Publish new rooms and check verification status.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-deep-green hover:bg-primary text-on-primary px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
        >
          {showAddForm ? 'Cancel' : 'Add Property'}
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-xs font-bold text-deep-green animate-pulse">
          {successMsg}
        </div>
      )}

      {/* Add listing form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-card p-6 shadow-level-1 border border-[#B8D9B0] flex flex-col gap-4">
          <h2 className="text-sm font-bold text-primary">List Your Property</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#7A8F7A]">Property Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-[#B8D9B0] rounded-lg text-sm outline-none focus:border-primary bg-white"
                placeholder="e.g. Silver Oaks Residency"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#7A8F7A]">Rent Price per Month (₹)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-[#B8D9B0] rounded-lg text-sm outline-none focus:border-primary bg-white"
                placeholder="e.g. 8000"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#7A8F7A]">Property Location / Address</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-[#B8D9B0] rounded-lg text-sm outline-none focus:border-primary bg-white"
                placeholder="e.g. Greater Noida"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#7A8F7A]">Distance to Nearest College</label>
              <input
                type="text"
                required
                value={distanceText}
                onChange={(e) => setDistanceText(e.target.value)}
                className="w-full px-3 py-2 border border-[#B8D9B0] rounded-lg text-sm outline-none focus:border-primary bg-white"
                placeholder="e.g. 5 mins walk to college"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#7A8F7A]">PG Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 border border-[#B8D9B0] rounded-lg text-sm outline-none focus:border-primary bg-white cursor-pointer"
              >
                <option value="Boys">Boys PG</option>
                <option value="Girls">Girls PG</option>
                <option value="Co-ed">Co-ed PG</option>
              </select>
            </div>

            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#7A8F7A]">Description</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-[#B8D9B0] rounded-lg text-sm outline-none focus:border-primary bg-white resize-none"
                placeholder="Describe rooms, safety facilities, curfew guidelines, etc."
              ></textarea>
            </div>

            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#7A8F7A]">Amenities Provided</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.keys(amenities).map((a) => (
                  <label key={a} className="flex items-center gap-2 text-xs text-on-surface cursor-pointer">
                    <input
                      type="checkbox"
                      checked={amenities[a]}
                      onChange={() => handleAmenityChange(a)}
                      className="rounded border-[#B8D9B0] text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                    {a}
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-[#B8D9B0] rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container-low cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-deep-green hover:bg-primary text-on-primary px-6 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                Submit Listing
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Property Listings grid */}
      <div className="bg-white rounded-card p-6 shadow-level-1 border border-outline-variant flex flex-col gap-4">
        <h2 className="text-sm font-bold text-[#333333] border-b border-outline-variant pb-3">My Properties</h2>

        {ownerListings.length > 0 ? (
          <div className="flex flex-col gap-4">
            {ownerListings.map((listing) => (
              <div 
                key={listing.id}
                className="border border-outline-variant rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-outline-variant shrink-0 bg-surface-container-low">
                    <img 
                      src={listing.image} 
                      alt={listing.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-sm flex items-center gap-2">
                      {listing.title}
                      {listing.verified ? (
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">Verified</span>
                      ) : (
                        <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold">Pending Review</span>
                      )}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">{listing.location}</p>
                    <p className="text-xs text-on-surface-variant font-semibold mt-1">₹{listing.price.toLocaleString()}/mo</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-on-surface-variant font-medium">Rating: {listing.rating} ★</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-5xl text-outline-variant">holiday_village</span>
            <p className="text-sm font-medium text-on-surface-variant">You haven&apos;t listed any properties yet</p>
            <p className="text-xs text-on-surface-variant max-w-sm">
              Add your PG accommodation to start receiving visit requests from students.
            </p>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-deep-green hover:bg-primary text-on-primary px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer mt-1"
              >
                Add Property
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
