'use client';

import React, { useState } from 'react';
import { usePersona } from '@/context/PersonaContext';

export default function StudentReviews() {
  const { listings, setListings, bookings } = usePersona();

  // Review states
  const [selectedPgId, setSelectedPgId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Allow reviewing any PG from bookings or list
  const reviewablePgs = listings;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPgId || !comment) return;

    // Add review to listing in context
    setListings((prevListings) =>
      prevListings.map((l) => {
        if (l.id === selectedPgId) {
          const newReview = {
            id: `rev-${Date.now()}`,
            author: 'Aarav Malhotra', // Mock student name
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
