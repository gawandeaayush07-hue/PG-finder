-- =====================================================================
-- Migration: 009_property_integrity.sql
-- Description: BEFORE INSERT OR UPDATE trigger on public.properties that
--   guards privileged columns from client-side manipulation, auto-generates
--   slugs, enforces owner_id = auth.uid(), and limits owners to 10 properties.
--
-- Existing SECURITY DEFINER functions that UPDATE properties are UNAFFECTED
-- because current_user inside them resolves to the function owner (postgres),
-- not 'authenticated'/'anon'. Specifically:
--   - update_property_rating_stats()  [004] — writes rating, reviews_count
--   - handle_verification_approval()  [004] — writes is_verified
--   - handle_updated_at()             [004] — writes updated_at (no SECURITY
--     DEFINER, but only touches updated_at which is not guarded here)
-- =====================================================================

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
    -- Only restrict client-facing callers.
    -- SECURITY DEFINER functions, service_role, postgres, and supabase_admin
    -- execute with a different current_user and are never blocked.
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
        NEW.is_verified   := FALSE;
        NEW.is_premium    := FALSE;
        NEW.rating        := 0;
        NEW.reviews_count := 0;

        -- 4. Auto-generate slug (client value is ignored)
        --    lower + strip non-alnum to hyphens + trim edge hyphens + 6-char uuid suffix
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

        IF NEW.is_premium IS DISTINCT FROM OLD.is_premium THEN
            RAISE EXCEPTION 'Property security: only administrators can modify is_premium.'
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

        IF NEW.owner_id IS DISTINCT FROM OLD.owner_id THEN
            RAISE EXCEPTION 'Property security: owner_id is immutable.'
                USING ERRCODE = '42501';
        END IF;

        IF NEW.slug IS DISTINCT FROM OLD.slug THEN
            RAISE EXCEPTION 'Property security: slug is immutable after creation.'
                USING ERRCODE = '42501';
        END IF;

        -- is_active: owner may toggle (pause / unpause) — intentionally allowed

        RETURN NEW;
    END IF;

    RETURN NEW;
END;
$$;

-- Idempotent trigger installation
DROP TRIGGER IF EXISTS trg_property_integrity ON public.properties;
CREATE TRIGGER trg_property_integrity
    BEFORE INSERT OR UPDATE ON public.properties
    FOR EACH ROW EXECUTE FUNCTION public.enforce_property_integrity();
