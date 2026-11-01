-- =====================================================================
-- Migration: 018_clean_booking_student_email.sql
-- Description: Phone-signup accounts have a hidden placeholder login email
--              (91XXXXXXXXXX@phone.pgfinder.app). The booking snapshot copies
--              profiles.email, which would show that fake address to owners.
--              This BEFORE INSERT trigger runs after the existing booking
--              trigger (name sorts last) and swaps the placeholder for the
--              student's real optional contact_email (or NULL).
-- =====================================================================

CREATE OR REPLACE FUNCTION public.clean_student_email_on_booking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    real_contact TEXT;
BEGIN
    IF NEW.student_email IS NOT NULL AND (
        NEW.student_email ILIKE '%@phone.pgfinder.app' OR
        NEW.student_email ILIKE '%@phone.pgfinder.invalid'
    ) THEN
        SELECT contact_email INTO real_contact
        FROM public.profiles
        WHERE id = NEW.student_id;

        NEW.student_email := real_contact;  -- may be NULL, which is fine
    END IF;

    RETURN NEW;
END;
$$;

-- Attach it to whichever table holds the student_email column
DO $$
DECLARE
    t TEXT;
BEGIN
    SELECT table_name INTO t
    FROM information_schema.columns
    WHERE table_schema = 'public' AND column_name = 'student_email'
    LIMIT 1;

    IF t IS NULL THEN
        RAISE EXCEPTION 'Could not find a table with a student_email column.';
    END IF;

    EXECUTE format('DROP TRIGGER IF EXISTS zz_clean_student_email ON public.%I', t);
    EXECUTE format(
        'CREATE TRIGGER zz_clean_student_email BEFORE INSERT ON public.%I
         FOR EACH ROW EXECUTE FUNCTION public.clean_student_email_on_booking()',
        t
    );
END;
$$;
