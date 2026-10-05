-- =====================================================================
-- Migration: 006_security_and_integrity_fixes.sql
-- Description: Corrective security and data integrity migration for PGFinder.
--   - Fixes booking authorization (owner_id injection, student/owner confusion,
--     state-transition enforcement)
--   - Hardens review eligibility and removes client control of is_verified_resident
--   - Tightens profile role mutation protection at the RLS layer
--   - Fixes storage INSERT policy for property-images (was any authenticated user)
--   - Adds missing integrity constraints:
--       rooms.available_beds <= rooms.total_beds
--       bookings_visits.student_id <> owner_id
--       unique partial index: one primary image per property
--   - Documents review eligibility rule in comments
-- =====================================================================

-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  SECTION 1 — SCHEMA INTEGRITY CONSTRAINTS                          ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- 1a. rooms: available_beds must not exceed total_beds
-- The previous schema only checked available_beds >= 0, which allows
-- available_beds = 99 on a 1-bed room.
ALTER TABLE public.rooms
    DROP CONSTRAINT IF EXISTS rooms_available_beds_check,
    ADD CONSTRAINT rooms_available_beds_check
        CHECK (available_beds >= 0 AND available_beds <= total_beds);

-- 1b. bookings_visits: a student cannot book their own property
-- Without this, an owner who is also listed as a student could create
-- a trivial self-loop booking. Enforce at the DB layer.
ALTER TABLE public.bookings_visits
    ADD CONSTRAINT bv_student_ne_owner
        CHECK (student_id <> owner_id);

-- 1c. bookings_visits: visit_date must be today or in the future at creation time
-- Note: PostgreSQL CHECK constraints cannot call now() in a meaningful way
-- for INSERT-time enforcement across all databases; this is handled via
-- the trigger below instead. The constraint here enforces basic sanity
-- only (not NULL, which is already enforced). Future validation via trigger.

-- 1d. property_images: enforce at most one primary image per property
-- A partial unique index is the correct PostgreSQL mechanism for this.
-- If a record with is_primary = TRUE already exists for a property_id,
-- a second INSERT with is_primary = TRUE will be rejected.
CREATE UNIQUE INDEX IF NOT EXISTS uq_property_primary_image
    ON public.property_images (property_id)
    WHERE is_primary = TRUE;

-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  SECTION 2 — BOOKING AUTHORIZATION TRIGGER                         ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- Problem (002_rls_policies.sql, booking INSERT):
--   WITH CHECK (auth.uid() = student_id)
--   A student can supply any arbitrary owner_id value. They could point
--   to a friend's UUID, or even attempt to set owner_id = student_id.
--   The DB had no mechanism to verify that owner_id matches the actual
--   owner of the chosen property.
--
-- Problem (002_rls_policies.sql, booking UPDATE):
--   The blanket UPDATE policy allows students to change status to
--   'Confirmed' or 'Declined' — transitions that only owners or admins
--   should perform.
--
-- Fix: Replace the free-form RLS policies with a BEFORE INSERT + BEFORE
-- UPDATE trigger that enforces:
--   INSERT: owner_id is automatically resolved from properties.owner_id,
--           student cannot manipulate it; student_id must match auth.uid().
--   UPDATE: state-machine transitions are role-gated.

CREATE OR REPLACE FUNCTION public.enforce_booking_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    actual_owner_id UUID;
    caller_is_admin  BOOLEAN;
    caller_id        UUID;
BEGIN
    caller_id       := auth.uid();
    caller_is_admin := public.is_admin();

    -- ── INSERT path ─────────────────────────────────────────────────────
    IF TG_OP = 'INSERT' THEN

        -- 1. Caller must be the student recorded in the row
        IF caller_id IS NULL OR caller_id <> NEW.student_id THEN
            RAISE EXCEPTION 'Booking security: student_id must equal the authenticated user.'
                USING ERRCODE = '42501';
        END IF;

        -- 2. Resolve the real owner_id from the properties table
        SELECT owner_id INTO actual_owner_id
        FROM public.properties
        WHERE id = NEW.property_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Booking security: referenced property does not exist.'
                USING ERRCODE = 'P0002';
        END IF;

        -- 3. Silently correct or reject a tampered owner_id
        --    We correct rather than reject so the UI does not need to
        --    look up the owner_id before calling insert.
        NEW.owner_id := actual_owner_id;

        -- 4. student cannot book their own property
        IF NEW.student_id = NEW.owner_id THEN
            RAISE EXCEPTION 'Booking security: you cannot book a visit to your own property.'
                USING ERRCODE = '42501';
        END IF;

        -- 5. New bookings must start in Pending status only
        IF NEW.status <> 'Pending' THEN
            IF NOT caller_is_admin THEN
                RAISE EXCEPTION 'Booking security: new bookings must have status Pending.'
                    USING ERRCODE = '42501';
            END IF;
        END IF;

        -- 6. visit_date must be today or future
        IF NEW.visit_date < CURRENT_DATE THEN
            RAISE EXCEPTION 'Booking security: visit_date cannot be in the past.'
                USING ERRCODE = '22023';
        END IF;

        -- 7. time_slot must be a recognized value
        IF NEW.time_slot NOT IN (
            'Morning (10 AM - 12 PM)',
            'Afternoon (1 PM - 4 PM)',
            'Evening (5 PM - 7 PM)'
        ) THEN
            RAISE EXCEPTION 'Booking security: unrecognized time_slot value "%" — must be Morning, Afternoon, or Evening.',
                NEW.time_slot
                USING ERRCODE = '22023';
        END IF;

        RETURN NEW;
    END IF;

    -- ── UPDATE path ─────────────────────────────────────────────────────
    IF TG_OP = 'UPDATE' THEN

        -- Admins may change anything
        IF caller_is_admin THEN
            RETURN NEW;
        END IF;

        -- Immutable columns: student_id, owner_id, property_id must never change
        IF NEW.student_id  <> OLD.student_id  THEN
            RAISE EXCEPTION 'Booking security: student_id is immutable after creation.'
                USING ERRCODE = '42501';
        END IF;
        IF NEW.owner_id    <> OLD.owner_id    THEN
            RAISE EXCEPTION 'Booking security: owner_id is immutable after creation.'
                USING ERRCODE = '42501';
        END IF;
        IF NEW.property_id <> OLD.property_id THEN
            RAISE EXCEPTION 'Booking security: property_id is immutable after creation.'
                USING ERRCODE = '42501';
        END IF;

        -- ── Owner-permitted transitions ────────────────────────────────
        IF caller_id = OLD.owner_id THEN
            -- Owners may only act on Pending or Rescheduled bookings
            IF OLD.status NOT IN ('Pending', 'Rescheduled') THEN
                RAISE EXCEPTION 'Booking security: owner can only act on Pending or Rescheduled bookings (current: %).',
                    OLD.status USING ERRCODE = '42501';
            END IF;
            -- Owner-valid target states
            IF NEW.status NOT IN ('Confirmed', 'Declined', 'Rescheduled') THEN
                RAISE EXCEPTION 'Booking security: owner cannot transition booking to status %.',
                    NEW.status USING ERRCODE = '42501';
            END IF;
            RETURN NEW;
        END IF;

        -- ── Student-permitted transitions ──────────────────────────────
        IF caller_id = OLD.student_id THEN
            -- Students may only cancel their own bookings
            IF NEW.status <> 'Cancelled' THEN
                RAISE EXCEPTION 'Booking security: students may only cancel their own bookings (attempted: %).',
                    NEW.status USING ERRCODE = '42501';
            END IF;
            -- Students can only cancel from Pending or Confirmed
            IF OLD.status NOT IN ('Pending', 'Confirmed') THEN
                RAISE EXCEPTION 'Booking security: cannot cancel a booking with status %.',
                    OLD.status USING ERRCODE = '42501';
            END IF;
            RETURN NEW;
        END IF;

        -- Neither admin, owner, nor the student — reject
        RAISE EXCEPTION 'Booking security: you do not have permission to modify this booking.'
            USING ERRCODE = '42501';
    END IF;

    RETURN NEW;
END;
$$;

-- Drop old generic triggers on bookings_visits, replace with the authoritative one
DROP TRIGGER IF EXISTS trg_booking_integrity_insert ON public.bookings_visits;
CREATE TRIGGER trg_booking_integrity_insert
    BEFORE INSERT ON public.bookings_visits
    FOR EACH ROW EXECUTE FUNCTION public.enforce_booking_integrity();

DROP TRIGGER IF EXISTS trg_booking_integrity_update ON public.bookings_visits;
CREATE TRIGGER trg_booking_integrity_update
    BEFORE UPDATE ON public.bookings_visits
    FOR EACH ROW EXECUTE FUNCTION public.enforce_booking_integrity();

-- Tighten the RLS INSERT policy for bookings to not rely on free-form owner_id
-- Drop the permissive original and replace with a tighter version.
DROP POLICY IF EXISTS "Students can request tours" ON public.bookings_visits;
CREATE POLICY "Students can request tours"
    ON public.bookings_visits
    FOR INSERT
    WITH CHECK (
        -- Caller must be the student in the row
        auth.uid() = student_id
        -- Booking must begin as Pending
        AND status = 'Pending'
        -- Property must exist (owner_id will be enforced/corrected by trigger)
        AND EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = property_id
              AND p.is_active = TRUE
        )
    );

-- Replace the overly broad UPDATE policy with role-scoped policies
DROP POLICY IF EXISTS "Participants and Admins can update booking status" ON public.bookings_visits;

CREATE POLICY "Owners can update bookings for their properties"
    ON public.bookings_visits
    FOR UPDATE
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Students can cancel their own bookings"
    ON public.bookings_visits
    FOR UPDATE
    USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id AND status = 'Cancelled');

CREATE POLICY "Admins can update any booking"
    ON public.bookings_visits
    FOR UPDATE
    USING (public.is_admin());

-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  SECTION 3 — REVIEW ELIGIBILITY & is_verified_resident HARDENING   ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- Problem: is_verified_resident is a client-writable column. Any student
-- can send { is_verified_resident: true } and claim verified residency.
--
-- Eligibility rule chosen (documented):
--   A student is considered a VERIFIED RESIDENT if they have at least one
--   bookings_visits record for the same property with status = 'Completed'.
--   "Completed" is an owner-or-admin-set terminal state meaning the physical
--   visit actually happened. This is the closest the current schema can come
--   to confirming genuine interaction without a separate tenancy record.
--
--   If no 'Completed' booking exists, is_verified_resident is forced FALSE
--   regardless of what the client submits.
--
-- NOTE: True rent-payment-based residency verification is not possible in
-- Phase 1 (payment integration is Phase 6). This rule is explicitly scoped
-- to "has completed at least one physical tour" as a proxy, and is clearly
-- labelled as such in application copy.

CREATE OR REPLACE FUNCTION public.enforce_review_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    has_completed_visit BOOLEAN;
    caller_is_admin     BOOLEAN;
BEGIN
    caller_is_admin := public.is_admin();

    -- ── INSERT ───────────────────────────────────────────────────────────
    IF TG_OP = 'INSERT' THEN

        -- Caller must be the student recorded in the row
        IF auth.uid() IS NULL OR auth.uid() <> NEW.student_id THEN
            RAISE EXCEPTION 'Review security: student_id must equal the authenticated user.'
                USING ERRCODE = '42501';
        END IF;

        -- A student may not review their own property
        IF EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = NEW.property_id
              AND p.owner_id = NEW.student_id
        ) THEN
            RAISE EXCEPTION 'Review security: you cannot review your own property.'
                USING ERRCODE = '42501';
        END IF;

        -- Determine verified residency from DB state — never from client input
        SELECT EXISTS (
            SELECT 1 FROM public.bookings_visits bv
            WHERE bv.property_id = NEW.property_id
              AND bv.student_id  = NEW.student_id
              AND bv.status      = 'Completed'
        ) INTO has_completed_visit;

        -- Silently correct is_verified_resident to the server-computed value
        NEW.is_verified_resident := has_completed_visit;

        RETURN NEW;
    END IF;

    -- ── UPDATE ───────────────────────────────────────────────────────────
    IF TG_OP = 'UPDATE' THEN

        -- Admins can update freely
        IF caller_is_admin THEN
            RETURN NEW;
        END IF;

        -- Students can update their own review content (rating, comment)
        IF auth.uid() = OLD.student_id THEN
            -- Re-compute is_verified_resident on edit — do not trust client
            SELECT EXISTS (
                SELECT 1 FROM public.bookings_visits bv
                WHERE bv.property_id = NEW.property_id
                  AND bv.student_id  = NEW.student_id
                  AND bv.status      = 'Completed'
            ) INTO has_completed_visit;

            NEW.is_verified_resident := has_completed_visit;

            -- Students cannot reassign review to a different property or student
            IF NEW.property_id <> OLD.property_id OR NEW.student_id <> OLD.student_id THEN
                RAISE EXCEPTION 'Review security: property_id and student_id are immutable.'
                    USING ERRCODE = '42501';
            END IF;

            RETURN NEW;
        END IF;

        RAISE EXCEPTION 'Review security: you do not have permission to modify this review.'
            USING ERRCODE = '42501';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_review_integrity_insert ON public.reviews;
CREATE TRIGGER trg_review_integrity_insert
    BEFORE INSERT ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.enforce_review_integrity();

DROP TRIGGER IF EXISTS trg_review_integrity_update ON public.reviews;
CREATE TRIGGER trg_review_integrity_update
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.enforce_review_integrity();

-- Tighten INSERT RLS on reviews to match trigger guarantees
DROP POLICY IF EXISTS "Students can post reviews" ON public.reviews;
CREATE POLICY "Students can post reviews"
    ON public.reviews
    FOR INSERT
    WITH CHECK (
        -- Caller must be the student listed in the review
        auth.uid() = student_id
        -- Student must not be the property owner
        AND NOT EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = property_id
              AND p.owner_id = auth.uid()
        )
    );

-- Tighten UPDATE RLS on reviews
DROP POLICY IF EXISTS "Authors and Admins can edit reviews" ON public.reviews;
CREATE POLICY "Authors and Admins can edit reviews"
    ON public.reviews
    FOR UPDATE
    USING (auth.uid() = student_id OR public.is_admin())
    -- is_verified_resident is server-set; the rest are allowed to change
    WITH CHECK (auth.uid() = student_id OR public.is_admin());

-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  SECTION 4 — PROFILE ROLE MUTATION PROTECTION                      ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- Problem: The existing UPDATE policy on profiles uses:
--   WITH CHECK (auth.uid() = id OR public.is_admin())
-- This means the row-level check passes for a normal user updating their
-- own profile even if the payload includes role = 'ADMIN'. The
-- prevent_admin_self_assignment TRIGGER (004) catches this, but defense
-- should also exist at the RLS layer so the request never even reaches
-- the trigger on the sensitive column.
--
-- Fix: Replace the single broad policy with two scoped policies:
--   a) Self-update: allowed for all columns EXCEPT role.
--      role is left to policy (b) + the existing trigger.
--   b) Role update: only admins may change the role column.

-- Drop the original permissive policy
DROP POLICY IF EXISTS "Users can update their own profile (or Admin)" ON public.profiles;

-- Policy A: users can update their own non-role profile fields
CREATE POLICY "Users can update their own profile fields"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        -- Ensure the role column is not being changed by a non-admin
        -- (NEW.role = OLD.role equivalent enforced via the trigger;
        --  here we guarantee only the row owner can reach this policy)
        AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    );

-- Policy B: admins can update any profile including role
CREATE POLICY "Admins can update any profile including role"
    ON public.profiles
    FOR UPDATE
    USING (public.is_admin());

-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  SECTION 5 — STORAGE POLICY HARDENING                              ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- Problem A: property-images INSERT was open to ANY authenticated user.
--   Old: WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated')
--   Any student, any user, could upload images to the property-images bucket.
--   Fix: restrict to users who own at least one property (OWNER or ADMIN).
--        The folder structure is <property_id>/<filename>, so we validate
--        that (storage.foldername(name))[1] is a property_id whose owner
--        is the authenticated user.

DROP POLICY IF EXISTS "Authenticated owners and admins can upload property images"
    ON storage.objects;

CREATE POLICY "Property owners and admins can upload property images"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'property-images'
        AND auth.role() = 'authenticated'
        AND (
            -- Caller must own the property referenced by the first path segment
            EXISTS (
                SELECT 1 FROM public.properties p
                WHERE p.id::text = (storage.foldername(name))[1]
                  AND p.owner_id = auth.uid()
            )
            OR public.is_admin()
        )
    );

-- Problem B: property-images UPDATE used folder-based ownership only.
--   The folder may contain a property_id that the caller no longer owns
--   (e.g. after ownership transfer, which is not a current feature but
--   the constraint should still be correct-by-construction).
--   Fix: validate against properties table on UPDATE as well.

DROP POLICY IF EXISTS "Owners and admins can update property images" ON storage.objects;

CREATE POLICY "Property owners and admins can update property images"
    ON storage.objects
    FOR UPDATE
    USING (
        bucket_id = 'property-images'
        AND (
            EXISTS (
                SELECT 1 FROM public.properties p
                WHERE p.id::text = (storage.foldername(name))[1]
                  AND p.owner_id = auth.uid()
            )
            OR public.is_admin()
        )
    );

-- Problem C: property-images DELETE had same folder-only check.
DROP POLICY IF EXISTS "Owners and admins can delete property images" ON storage.objects;

CREATE POLICY "Property owners and admins can delete property images"
    ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'property-images'
        AND (
            EXISTS (
                SELECT 1 FROM public.properties p
                WHERE p.id::text = (storage.foldername(name))[1]
                  AND p.owner_id = auth.uid()
            )
            OR public.is_admin()
        )
    );

-- Problem D: verification-documents had no UPDATE policy, meaning owners
--   could UPDATE their own documents after submission (e.g. swap file_url
--   after admin has started reviewing). Prevent this.
--   Only admins may update verification documents (status changes, notes).
--   Owners must re-submit (delete + new insert while still Pending).

-- (No existing UPDATE policy to drop — ensure none slips through)
DROP POLICY IF EXISTS "Owners can update verification documents" ON storage.objects;

-- Confirm the correct Admin-only UPDATE for verification-documents storage
CREATE POLICY "Admins can update verification document storage objects"
    ON storage.objects
    FOR UPDATE
    USING (
        bucket_id = 'verification-documents'
        AND public.is_admin()
    );

-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  SECTION 6 — OWNER TOUR AVAILABILITY OWNERSHIP VALIDATION           ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- Problem: owner_tour_availability.property_id can be set to any property UUID.
--   The RLS INSERT check only confirms auth.uid() = owner_id, but does not
--   confirm that the owner actually owns the referenced property_id.
--   An owner could create availability settings for a competitor's property.

DROP POLICY IF EXISTS "Owners and Admins can configure availability" ON public.owner_tour_availability;

CREATE POLICY "Owners and Admins can configure availability"
    ON public.owner_tour_availability
    FOR INSERT
    WITH CHECK (
        auth.uid() = owner_id
        AND (
            -- Either property_id is NULL (global slot for all their properties)
            property_id IS NULL
            -- Or the property is actually owned by this user
            OR EXISTS (
                SELECT 1 FROM public.properties p
                WHERE p.id       = property_id
                  AND p.owner_id = auth.uid()
            )
        )
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "Owners and Admins can update availability" ON public.owner_tour_availability;

CREATE POLICY "Owners and Admins can update availability"
    ON public.owner_tour_availability
    FOR UPDATE
    USING (auth.uid() = owner_id OR public.is_admin())
    WITH CHECK (
        (
            auth.uid() = owner_id
            AND (
                property_id IS NULL
                OR EXISTS (
                    SELECT 1 FROM public.properties p
                    WHERE p.id       = property_id
                      AND p.owner_id = auth.uid()
                )
            )
        )
        OR public.is_admin()
    );

-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  SECTION 7 — ADDITIONAL INTEGRITY: BOOKING VISIT DATE NOT PAST     ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- The trigger enforce_booking_integrity already validates visit_date >= CURRENT_DATE
-- on INSERT. For completeness we also prevent rescheduled dates from being
-- set to the past during an owner UPDATE.

CREATE OR REPLACE FUNCTION public.enforce_booking_visit_date()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- On any status change that sets a new visit_date, it must be >= today
    IF NEW.visit_date < CURRENT_DATE AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Booking security: visit_date cannot be set to a past date.'
            USING ERRCODE = '22023';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_booking_visit_date_check ON public.bookings_visits;
CREATE TRIGGER trg_booking_visit_date_check
    BEFORE UPDATE OF visit_date ON public.bookings_visits
    FOR EACH ROW EXECUTE FUNCTION public.enforce_booking_visit_date();

-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  SECTION 8 — LINT-IDENTIFIED PRE-EXISTING FRONTEND ISSUES NOTE     ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- The following ESLint errors exist in the FRONTEND (not in migrations) and
-- are flagged here as out-of-scope for Phase 1 database work.
-- They MUST be fixed before Phase 2 (auth integration) begins:
--
--   premium/processing/page.tsx line 14:
--     Math.random() called during render — move to useState initializer or useMemo.
--
--   premium/success/page.tsx line 14:
--     Math.random() called during render — same fix needed.
--
--   premium/status/page.tsx line 189:
--     Unescaped apostrophe — replace ' with &apos;
--
--   search/page.tsx line 298:
--     Unescaped apostrophe — replace ' with &apos;
--
--   context/PersonaContext.tsx line 288:
--     setState called synchronously inside useEffect — move initial value
--     to useState() initializer using lazy initialization:
--       const [role, setRole] = useState<UserRole>(() => {
--         if (typeof window === 'undefined') return 'GUEST';
--         return (localStorage.getItem('pgfinder_persona_role') as UserRole) || 'GUEST';
--       });
--
-- These are recorded here as part of the security review audit trail.
-- They are pre-existing issues unrelated to the database migrations.
