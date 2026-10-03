-- =====================================================================
-- Migration: 008_booking_contact_snapshot.sql
-- Description: Add student contact snapshot columns to bookings_visits,
--              harden enforce_booking_integrity with profile snapshotting,
--              phone validation, strict column immutability on UPDATE,
--              and add unique index for active booking slots.
-- =====================================================================

-- 1. Snapshot columns for student contact info on bookings
ALTER TABLE public.bookings_visits
    ADD COLUMN IF NOT EXISTS student_name TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS student_email TEXT;

-- 2. Authoritative booking integrity function
CREATE OR REPLACE FUNCTION public.enforce_booking_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    actual_owner_id      UUID;
    caller_is_admin       BOOLEAN;
    caller_id             UUID;
    student_full_name     TEXT;
    student_user_email    TEXT;
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

        -- 3. Silently correct or set owner_id from property record
        NEW.owner_id := actual_owner_id;

        -- 4. Student cannot book their own property
        IF NEW.student_id = NEW.owner_id THEN
            RAISE EXCEPTION 'Booking security: you cannot book a visit to your own property.'
                USING ERRCODE = '42501';
        END IF;

        -- 5. New bookings must start in Pending status only (admins exempted)
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

        -- 8. Snapshot student_name and student_email from public.profiles
        SELECT full_name, email INTO student_full_name, student_user_email
        FROM public.profiles
        WHERE id = NEW.student_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Booking security: student profile does not exist.'
                USING ERRCODE = 'P0002';
        END IF;

        NEW.student_name  := COALESCE(student_full_name, '');
        NEW.student_email := student_user_email;

        -- 9. Trim student_phone and validate length if provided
        IF NEW.student_phone IS NOT NULL THEN
            NEW.student_phone := trim(NEW.student_phone);
            IF length(NEW.student_phone) < 7 OR length(NEW.student_phone) > 20 THEN
                RAISE EXCEPTION 'Booking security: student_phone must be between 7 and 20 characters.'
                    USING ERRCODE = '22023';
            END IF;
        END IF;

        RETURN NEW;
    END IF;

    -- ── UPDATE path ─────────────────────────────────────────────────────
    IF TG_OP = 'UPDATE' THEN

        -- Admins may change anything
        IF caller_is_admin THEN
            RETURN NEW;
        END IF;

        -- Immutable columns for non-admins
        IF NEW.student_id   IS DISTINCT FROM OLD.student_id   OR
           NEW.property_id  IS DISTINCT FROM OLD.property_id  OR
           NEW.owner_id     IS DISTINCT FROM OLD.owner_id     OR
           NEW.visit_date   IS DISTINCT FROM OLD.visit_date   OR
           NEW.time_slot    IS DISTINCT FROM OLD.time_slot    OR
           NEW.student_name  IS DISTINCT FROM OLD.student_name  OR
           NEW.student_email IS DISTINCT FROM OLD.student_email OR
           NEW.student_phone IS DISTINCT FROM OLD.student_phone THEN
            RAISE EXCEPTION 'Booking security: booking details (student, property, owner, date, slot, contact info) are immutable after creation.'
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

        -- Neither admin, owner, nor student — reject
        RAISE EXCEPTION 'Booking security: you do not have permission to modify this booking.'
            USING ERRCODE = '42501';
    END IF;

    RETURN NEW;
END;
$$;

-- Ensure triggers point to the updated function
DROP TRIGGER IF EXISTS trg_booking_integrity_insert ON public.bookings_visits;
CREATE TRIGGER trg_booking_integrity_insert
    BEFORE INSERT ON public.bookings_visits
    FOR EACH ROW EXECUTE FUNCTION public.enforce_booking_integrity();

DROP TRIGGER IF EXISTS trg_booking_integrity_update ON public.bookings_visits;
CREATE TRIGGER trg_booking_integrity_update
    BEFORE UPDATE ON public.bookings_visits
    FOR EACH ROW EXECUTE FUNCTION public.enforce_booking_integrity();

-- 3. Prevent duplicate active bookings for the same student, property, date, and slot
CREATE UNIQUE INDEX IF NOT EXISTS uq_booking_active_slot
    ON public.bookings_visits (student_id, property_id, visit_date, time_slot)
    WHERE status IN ('Pending', 'Confirmed');
