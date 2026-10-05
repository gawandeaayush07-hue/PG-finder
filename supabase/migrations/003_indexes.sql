-- =====================================================================
-- Migration: 003_indexes.sql
-- Description: High-performance indexing strategy for PGFinder.
--              Includes Foreign Key lookup indexes, B-Tree filter 
--              composites, and GIN Trigram full-text search indexes.
-- =====================================================================

-- 1. Foreign Key Performance Indexes (Cascades & Join Performance)
CREATE INDEX IF NOT EXISTS idx_properties_owner_id 
    ON public.properties(owner_id);

CREATE INDEX IF NOT EXISTS idx_rooms_property_id 
    ON public.rooms(property_id);

CREATE INDEX IF NOT EXISTS idx_property_images_property_id 
    ON public.property_images(property_id);

CREATE INDEX IF NOT EXISTS idx_property_amenities_amenity_id 
    ON public.property_amenities(amenity_id);

CREATE INDEX IF NOT EXISTS idx_property_amenities_property_id 
    ON public.property_amenities(property_id);

CREATE INDEX IF NOT EXISTS idx_bookings_student_id 
    ON public.bookings_visits(student_id);

CREATE INDEX IF NOT EXISTS idx_bookings_owner_id 
    ON public.bookings_visits(owner_id);

CREATE INDEX IF NOT EXISTS idx_bookings_property_id 
    ON public.bookings_visits(property_id);

CREATE INDEX IF NOT EXISTS idx_shortlists_student_id 
    ON public.shortlists(student_id);

CREATE INDEX IF NOT EXISTS idx_shortlists_property_id 
    ON public.shortlists(property_id);

CREATE INDEX IF NOT EXISTS idx_reviews_property_id 
    ON public.reviews(property_id);

CREATE INDEX IF NOT EXISTS idx_reviews_student_id 
    ON public.reviews(student_id);

CREATE INDEX IF NOT EXISTS idx_verification_owner_id 
    ON public.verification_documents(owner_id);

CREATE INDEX IF NOT EXISTS idx_verification_property_id 
    ON public.verification_documents(property_id);

CREATE INDEX IF NOT EXISTS idx_reports_reporter_id 
    ON public.reports_flags(reporter_id);

CREATE INDEX IF NOT EXISTS idx_reports_target 
    ON public.reports_flags(target_type, target_id);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id 
    ON public.support_tickets(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id 
    ON public.notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id 
    ON public.premium_subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id 
    ON public.payment_transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_transactions_sub_id 
    ON public.payment_transactions(subscription_id);

-- 2. Search & Catalog Multi-Dimensional Filtering Indexes
CREATE INDEX IF NOT EXISTS idx_properties_search_composite 
    ON public.properties(city, gender_type, base_price, is_verified, is_active);

CREATE INDEX IF NOT EXISTS idx_properties_distance 
    ON public.properties(distance_km);

CREATE INDEX IF NOT EXISTS idx_properties_rating 
    ON public.properties(rating DESC);

CREATE INDEX IF NOT EXISTS idx_properties_price 
    ON public.properties(base_price ASC);

CREATE INDEX IF NOT EXISTS idx_properties_created_at 
    ON public.properties(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_properties_slug 
    ON public.properties(slug);

CREATE INDEX IF NOT EXISTS idx_rooms_availability 
    ON public.rooms(property_id, is_available, price);

-- 3. GIN Trigram Indexes for Fast Text Search & College Proximity Auto-Suggest
CREATE INDEX IF NOT EXISTS idx_properties_title_trgm 
    ON public.properties USING gin (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_properties_location_trgm 
    ON public.properties USING gin (location_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_properties_city_trgm 
    ON public.properties USING gin (city gin_trgm_ops);

-- 4. Calendar, Tour Scheduling, & Moderation Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_owner_date 
    ON public.bookings_visits(owner_id, visit_date);

CREATE INDEX IF NOT EXISTS idx_bookings_student_date 
    ON public.bookings_visits(student_id, visit_date);

CREATE INDEX IF NOT EXISTS idx_bookings_slot_conflict 
    ON public.bookings_visits(property_id, visit_date, time_slot, status);

CREATE INDEX IF NOT EXISTS idx_verification_pipeline_status 
    ON public.verification_documents(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reports_moderation_queue 
    ON public.reports_flags(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_support_ticket_queue 
    ON public.support_tickets(status, created_at DESC);

-- 5. Partial Index for Unread Notification Feed
CREATE INDEX IF NOT EXISTS idx_notifications_unread_feed 
    ON public.notifications(user_id, created_at DESC) 
    WHERE is_read = FALSE;

-- 6. Subscription & Gateway Lookup Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_order_lookup 
    ON public.premium_subscriptions(order_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_active_status 
    ON public.premium_subscriptions(user_id, status, valid_until);
