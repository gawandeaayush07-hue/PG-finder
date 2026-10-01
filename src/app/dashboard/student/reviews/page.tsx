'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePersona } from '@/context/PersonaContext';

export default function StudentReviews() {
  const { listings, setListings, user, profile } = usePersona();

  const isPlaceholderMode =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.includes('placeholder');

  const isDemo = process.env.NODE_ENV === 'development' && isPlaceholderMode && !user;

  // Review states
  const [selectedPgId, setSelectedPgId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Allow reviewing any PG from listings
  const reviewablePgs = listings;

  const authorName =
    profile?.full_name?.trim() ||
    (user?.user_metadata?.full_name as string)?.trim() ||
    (user?.email ? user.email.split('@')[0] : '') ||
    (isDemo ? 'Aarav Malhotra' : 'Student');

  // Real user: filter out mock seed reviews
  const userReviews = isDemo
    ? [
        {
          id: 'mock-rev-1',
          listingTitle: 'Green Leaf Residences',
          rating: 5,
          date: '2026-08-01',
          comment: 'Very clean rooms and nice food. Ramesh Uncle is very helpful.',
        },
        {
          id: 'mock-rev-2',
          listingTitle: "The Scholar's Abode",
          rating: 4,
          date: '2026-07-28',
          comment: 'Excellent high-speed Wi-Fi, perfect for study. Quiet environment.',
        },
      ]
    : listings.flatMap((l) =>
        (l.reviews || [])
          .filter((r) => profile?.full_name && r.author === profile.full_name)
          .map((r) => ({
            id: r.id,
            listingTitle: l.title,
            rating: r.rating,
            date: r.date,
            comment: r.comment,
          }))
      );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPgId || !comment) return;

    // Add review to listing in context
    setListings((prevListings) =>
      prevListings.map((l) => {
        if (l.id === selectedPgId) {
          const newReview = {
            id: `rev-${Date.now()}`,
            author: authorName,
            rating,
            date: new Date().toISOString().split('T')[0],
            comment,
          };
          const updatedReviews = [newReview, ...l.reviews];
          // Recalculate average rating
          const avgRating = parseFloat(
            (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
          );
          return {
            ...l,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: avgRating,
          };
        }
        return l;
      })
    );

    setSubmitted(true);
    setComment('');
    setSelectedPgId('');
  };

  return (
    <div className="bg-white rounded-card p-6 shadow-level-1 border border-outline-variant flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-primary">Reviews Hub</h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Share your experience to help fellow student community members find their next home.
        </p>
      </div>

      {/* My Reviews Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-bold text-[#333333]">My Reviews</h2>
        {userReviews.length > 0 ? (
          <div className="flex flex-col gap-3">
            {userReviews.map((rev) => (
              <div key={rev.id} className="border border-outline-variant rounded-xl p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-primary">{rev.listingTitle}</h3>
                  <span className="text-xs text-on-surface-variant">{rev.date}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[16px]"
                      style={{ fontVariationSettings: `'FILL' ${i < rev.rating ? 1 : 0}` }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="text-xs text-on-surface-variant">{rev.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-4xl text-outline-variant">rate_review</span>
            <p className="text-sm font-medium text-on-surface-variant">No reviews written yet</p>
            <p className="text-xs text-on-surface-variant max-w-sm">
              You haven&apos;t written any reviews yet. Share your feedback on visited properties to help other students.
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

      {submitted && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-600 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <div>
              <h4 className="font-bold text-deep-green">Review Submitted!</h4>
              <p className="text-xs text-on-secondary-container">Your feedback has been published on the PG details page.</p>
            </div>
          </div>
          <button 
            onClick={() => setSubmitted(false)}
            className="text-xs text-deep-green font-bold hover:underline cursor-pointer"
          >
            Write Another
          </button>
        </div>
      )}

      {/* Write a review form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 border border-outline-variant rounded-xl p-5 bg-surface-container-low/40">
        <h3 className="font-bold text-primary text-sm">Write a Property Review</h3>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#7A8F7A]">Select PG Accommodation</label>
          <select
            required
            value={selectedPgId}
            onChange={(e) => setSelectedPgId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#B8D9B0] text-sm focus:border-primary outline-none bg-white cursor-pointer"
          >
            <option value="">Choose a PG...</option>
            {reviewablePgs.map((pg) => (
              <option key={pg.id} value={pg.id}>
                {pg.title} ({pg.location})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#7A8F7A]">Your Rating</label>
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((stars) => (
              <button
                key={stars}
                type="button"
                onClick={() => setRating(stars)}
                className="text-amber-500 cursor-pointer focus:outline-none"
              >
                <span 
                  className="material-symbols-outlined text-2xl"
                  style={{ fontVariationSettings: `'FILL' ${rating >= stars ? 1 : 0}` }}
                >
                  star
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#7A8F7A]">Your Review Feedback</label>
          <textarea
            required
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#B8D9B0] text-sm focus:border-primary outline-none bg-white resize-none"
            placeholder="Share details about rooms, food quality, safety, curfew, and owner helpfulness..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-deep-green hover:bg-primary text-on-primary font-bold text-xs py-2.5 rounded-lg shadow-sm transition-colors mt-2 cursor-pointer"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}
