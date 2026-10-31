-- =====================================================================
-- Migration: 014_remove_premium.sql
-- Description: Completely remove premium subscriptions, payment transactions,
--              subscription_tier enum, and is_premium column on properties.
--              Update enforce_property_integrity() trigger function to remove
--              is_premium guard.
-- =====================================================================

-- 1. Update enforce_property_integrity() trigger function without is_premium references
CREATE OR REPLACE FUNCTION public.enforce_property_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
    prop_count INTEGER;
    base_slug  TEXT;
BEGIN
    -- Administrators and internal processes bypass client-facing integrity constraints
    IF current_user NOT IN ('authenticated', 'anon') OR public.is_admin() THEN
        RETURN NEW;
    END IF;

    -- ── INSERT ────────────────────────────────────────────────────────────
    IF TG_OP = 'INSERT' THEN

        -- 1. owner_id must be the authenticated caller
        IF NEW.owner_id IS NULL OR NEW.owner_id <> auth.uid() THEN
            RAISE EXCEPTION 'Property security: owner_id must equal the authenticated user.'
                USING ERRCODE = '42501';
        END IF;

        -- 2. Limit: max 10 properties per owner
        SELECT COUNT(*) INTO prop_count
        FROM public.properties
        WHERE owner_id = NEW.owner_id;

        IF prop_count >= 10 THEN
            RAISE EXCEPTION 'Property limit reached: you may not own more than 10 properties.'
                USING ERRCODE = '53400';
        END IF;

        -- 3. Force privileged columns to safe defaults
        NEW.is_verified      := FALSE;
        NEW.rating           := 0;
        NEW.reviews_count    := 0;
        NEW.rejection_reason := NULL;

        -- 4. Auto-generate slug
        base_slug := trim(both '-' from
            lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'))
        );
        NEW.slug := base_slug || '-' || left(gen_random_uuid()::text, 6);

        RETURN NEW;
    END IF;

    -- ── UPDATE ────────────────────────────────────────────────────────────
    IF TG_OP = 'UPDATE' THEN

        IF NEW.is_verified IS DISTINCT FROM OLD.is_verified THEN
            RAISE EXCEPTION 'Property security: only administrators can modify is_verified.'
                USING ERRCODE = '42501';
        END IF;

        IF NEW.rating IS DISTINCT FROM OLD.rating THEN
            RAISE EXCEPTION 'Property security: only administrators can modify rating.'
                USING ERRCODE = '42501';
        END IF;

        IF NEW.reviews_count IS DISTINCT FROM OLD.reviews_count THEN
            RAISE EXCEPTION 'Property security: only administrators can modify reviews_count.'
                USING ERRCODE = '42501';
        END IF;

        IF NEW.rejection_reason IS DISTINCT FROM OLD.rejection_reason THEN
            RAISE EXCEPTION 'Property security: only administrators can modify rejection_reason.'
                USING ERRCODE = '42501';
        END IF;

        IF NEW.owner_id IS DISTINCT FROM OLD.owner_id THEN
            RAISE EXCEPTION 'Property security: owner_id is immutable.'
                USING ERRCODE = '42501';
        END IF;

        IF NEW.slug IS DISTINCT FROM OLD.slug THEN
            RAISE EXCEPTION 'Property security: slug is immutable after creation.'
                USING ERRCODE = '42501';
        END IF;

        RETURN NEW;
    END IF;

    RETURN NEW;
END;
$$;

-- 2. Drop payment_transactions table (premium-only ledger)
DROP TABLE IF EXISTS public.payment_transactions CASCADE;

-- 3. Drop premium_subscriptions table (cascades policies, indexes, and triggers)
DROP TABLE IF EXISTS public.premium_subscriptions CASCADE;

-- 4. Drop subscription_tier enum
DROP TYPE IF EXISTS public.subscription_tier CASCADE;

-- 5. Drop is_premium column on properties
ALTER TABLE public.properties 
    DROP COLUMN IF EXISTS is_premium;

