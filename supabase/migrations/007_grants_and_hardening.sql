-- =====================================================================
-- Migration: 007_grants_and_hardening.sql
-- Description: Least-privilege role grants, profiles privacy lockdown,
--              security invoker trigger fixes, and payment policy hardening.
-- =====================================================================

-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  STEP 1 — REVOKE UNNECESSARY TABLE PRIVILEGES                        ║
-- ╚══════════════════════════════════════════════════════════════════════╝

REVOKE TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public FROM anon, authenticated;

-- Ensure schema usage is granted
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  STEP 2 — LEAST-PRIVILEGE ROLE GRANTS                               ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- 1. amenities: anon, authenticated SELECT; authenticated INSERT, UPDATE, DELETE
GRANT SELECT ON TABLE public.amenities TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.amenities TO authenticated;

-- 2. bookings_visits: authenticated SELECT, INSERT, UPDATE, DELETE
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.bookings_visits TO authenticated;

-- 3. notifications: authenticated SELECT, INSERT, UPDATE, DELETE
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.notifications TO authenticated;

-- 4. owner_tour_availability: anon, authenticated SELECT; authenticated INSERT, UPDATE, DELETE
GRANT SELECT ON TABLE public.owner_tour_availability TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.owner_tour_availability TO authenticated;

-- 5. payment_transactions: authenticated SELECT only
GRANT SELECT ON TABLE public.payment_transactions TO authenticated;

-- 6. premium_subscriptions: authenticated SELECT only
GRANT SELECT ON TABLE public.premium_subscriptions TO authenticated;

-- 7. profiles: authenticated SELECT, UPDATE only (no INSERT: handle_new_user() creates rows; no DELETE)
GRANT SELECT, UPDATE ON TABLE public.profiles TO authenticated;

-- 8. properties: anon, authenticated SELECT; authenticated INSERT, UPDATE, DELETE
GRANT SELECT ON TABLE public.properties TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.properties TO authenticated;

-- 9. property_amenities: anon, authenticated SELECT; authenticated INSERT, DELETE
GRANT SELECT ON TABLE public.property_amenities TO anon, authenticated;
GRANT INSERT, DELETE ON TABLE public.property_amenities TO authenticated;

-- 10. property_images: anon, authenticated SELECT; authenticated INSERT, UPDATE, DELETE
GRANT SELECT ON TABLE public.property_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.property_images TO authenticated;

-- 11. reports_flags: authenticated SELECT, INSERT, UPDATE, DELETE
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.reports_flags TO authenticated;

-- 12. reviews: anon, authenticated SELECT; authenticated INSERT, UPDATE, DELETE
GRANT SELECT ON TABLE public.reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.reviews TO authenticated;

-- 13. rooms: anon, authenticated SELECT; authenticated INSERT, UPDATE, DELETE
GRANT SELECT ON TABLE public.rooms TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.rooms TO authenticated;

-- 14. shortlists: authenticated SELECT, INSERT, UPDATE, DELETE
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.shortlists TO authenticated;

-- 15. support_tickets: authenticated SELECT, INSERT, UPDATE, DELETE (no anon; public contact form routes via server action)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.support_tickets TO authenticated;

-- 16. verification_documents: authenticated SELECT, INSERT, UPDATE, DELETE
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.verification_documents TO authenticated;

-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  STEP 3 — PROFILES PRIVACY & PUBLIC VIEW                             ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- Drop the overly permissive SELECT policy on profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users view own profile, admins view all" ON public.profiles;

-- Restrict profiles SELECT to row owner or system administrators
CREATE POLICY "Users view own profile, admins view all"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

-- Create safe public view that exposes only non-sensitive columns
-- security_invoker = false intentionally bypasses RLS on public.profiles
-- using the view owner's definer privileges to serve public cards & reviews safely.
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles
WITH (security_invoker = false)
AS
SELECT
    id,
    full_name,
    avatar_url,
    is_verified,
    college_name
FROM public.profiles
WHERE role = 'OWNER'
   OR id IN (SELECT student_id FROM public.reviews);

GRANT SELECT ON public.public_profiles TO anon, authenticated;

COMMENT ON VIEW public.public_profiles IS 'Safe profile subset (id, full_name, avatar_url, is_verified, college_name) restricted to property owners and review authors only. Intentionally bypasses RLS (security_invoker = false). Booking counterparty names must be fetched via a server action, not this view.';

-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  STEP 4 — PROFILE TRIGGERS (SECURITY INVOKER CHECKS)                 ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- Recreate prevent_admin_self_assignment as SECURITY INVOKER
-- When SECURITY DEFINER, current_user was the function owner ('postgres'), which
-- allowed clients to bypass the role elevation check. As SECURITY INVOKER,
-- current_user reflects the actual API caller ('authenticated' or 'anon').
CREATE OR REPLACE FUNCTION public.prevent_admin_self_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    IF current_user IN ('authenticated', 'anon')
       AND NOT public.is_admin()
       AND NEW.role IS DISTINCT FROM OLD.role THEN
        RAISE EXCEPTION 'Unauthorized privilege escalation: You cannot modify your role.'
            USING ERRCODE = '42501';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_admin_self_assignment ON public.profiles;
CREATE TRIGGER trg_prevent_admin_self_assignment
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.prevent_admin_self_assignment();

-- Protect privileged profile columns: is_verified and email
-- Only definer functions, service_role, or admins may change them.
CREATE OR REPLACE FUNCTION public.protect_profile_privileged_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    IF current_user IN ('authenticated', 'anon') AND NOT public.is_admin() THEN
        IF NEW.is_verified IS DISTINCT FROM OLD.is_verified THEN
            RAISE EXCEPTION 'Unauthorized column modification: Only administrators can modify is_verified.'
                USING ERRCODE = '42501';
        END IF;

        IF NEW.email IS DISTINCT FROM OLD.email THEN
            RAISE EXCEPTION 'Unauthorized column modification: Only administrators or auth hooks can modify email.'
                USING ERRCODE = '42501';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_privileged_columns ON public.profiles;
CREATE TRIGGER trg_protect_profile_privileged_columns
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.protect_profile_privileged_columns();

-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  STEP 5 — PAYMENTS HARDENING                                         ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- Remove client-facing INSERT policies on payment records
-- All payment transaction and premium subscription insertions/updates must be executed
-- server-side using service_role after Razorpay signature verification.
DROP POLICY IF EXISTS "Users and Service Role can create transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Users can create subscription orders" ON public.premium_subscriptions;
