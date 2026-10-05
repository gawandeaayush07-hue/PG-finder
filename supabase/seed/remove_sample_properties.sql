-- =====================================================================
-- Seed Cleanup: remove_sample_properties.sql
-- Description: Deletes ONLY the 6 sample properties created by sample_properties.sql.
-- 
-- Note: Cascading foreign keys (ON DELETE CASCADE) in the database schema
-- automatically remove all associated child records in:
--   - public.rooms
--   - public.property_images
--   - public.property_amenities
--   - public.owner_tour_availability
--   - public.bookings_visits
--   - public.shortlists
--   - public.reviews
--   - public.verification_documents
-- =====================================================================

BEGIN;

DELETE FROM public.properties
WHERE slug IN (
    'green-leaf-residency-akurdi',
    'scholars-abode-pradhikaran',
    'harmony-student-living-chinchwad',
    'silver-oaks-premium-hostel-akurdi',
    'sai-krupa-girls-residency-nigdi',
    'apex-student-hub-ravet-pradhikaran'
);

COMMIT;
