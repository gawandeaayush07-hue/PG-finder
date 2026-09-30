-- =====================================================================
-- Migration: 004_triggers_and_functions.sql
-- Description: Business logic triggers, security guards, automated 
--              profile creation, review calculations, and notifications.
-- =====================================================================

-- 1. Generic Updated At Timestamp Trigger Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

-- Apply updated_at triggers
DO $$ BEGIN
    CREATE TRIGGER trg_profiles_updated_at
        BEFORE UPDATE ON public.profiles
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_properties_updated_at
        BEFORE UPDATE ON public.properties
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_rooms_updated_at
        BEFORE UPDATE ON public.rooms
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_owner_tour_availability_updated_at
        BEFORE UPDATE ON public.owner_tour_availability
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_bookings_visits_updated_at
        BEFORE UPDATE ON public.bookings_visits
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_reviews_updated_at
        BEFORE UPDATE ON public.reviews
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_verification_documents_updated_at
        BEFORE UPDATE ON public.verification_documents
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_reports_flags_updated_at
        BEFORE UPDATE ON public.reports_flags
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_support_tickets_updated_at
        BEFORE UPDATE ON public.support_tickets
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_premium_subscriptions_updated_at
        BEFORE UPDATE ON public.premium_subscriptions
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Auth User Created Trigger (Auto-provision Profile & Prevent Self-Admin Assignment)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    raw_role TEXT;
    assigned_role user_role;
    user_name TEXT;
    user_phone TEXT;
    user_college TEXT;
BEGIN
    -- Extract role from metadata safely
    raw_role := COALESCE(NEW.raw_user_meta_data->>'role', 'STUDENT');
    
    -- CRITICAL SECURITY RULE: Never permit client self-assignment of ADMIN role on signup
    IF UPPER(raw_role) = 'ADMIN' THEN
        assigned_role := 'STUDENT'::user_role;
    ELSIF UPPER(raw_role) = 'OWNER' THEN
        assigned_role := 'OWNER'::user_role;
    ELSE
        assigned_role := 'STUDENT'::user_role;
    END IF;

    user_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1)
    );

    user_phone := NEW.raw_user_meta_data->>'phone';
    user_college := NEW.raw_user_meta_data->>'college_name';

    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        phone,
        role,
        avatar_url,
        college_name,
        is_verified
    ) VALUES (
        NEW.id,
        NEW.email,
        user_name,
        user_phone,
        assigned_role,
        NEW.raw_user_meta_data->>'avatar_url',
        user_college,
        FALSE
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name;

    RETURN NEW;
END;
$$;

-- Trigger to execute on auth.users after insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Prevent Privilege Escalation Trigger (Guard ADMIN role mutation)
CREATE OR REPLACE FUNCTION public.prevent_admin_self_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if user is attempting to change role to ADMIN
    IF NEW.role = 'ADMIN'::user_role AND (OLD.role IS NULL OR OLD.role <> 'ADMIN'::user_role) THEN
        -- Only allow if current executing user is already an Admin or database superuser/service_role
        IF NOT (public.is_admin() OR current_user IN ('postgres', 'service_role', 'supabase_admin')) THEN
            RAISE EXCEPTION 'Unauthorized privilege escalation: You cannot assign or elevate to the ADMIN role.'
                USING ERRCODE = '42501';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_admin_self_assignment ON public.profiles;
CREATE TRIGGER trg_prevent_admin_self_assignment
    BEFORE UPDATE OF role ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.prevent_admin_self_assignment();

-- 4. Review Statistics Aggregator (Maintains Property Average Rating & Count)
CREATE OR REPLACE FUNCTION public.update_property_rating_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    target_property_id UUID;
    avg_rating NUMERIC(2, 1);
    total_reviews INTEGER;
BEGIN
    IF TG_OP = 'DELETE' THEN
        target_property_id := OLD.property_id;
    ELSE
        target_property_id := NEW.property_id;
    END IF;

    -- Calculate aggregate stats
    SELECT 
        COALESCE(ROUND(AVG(rating)::numeric, 1), 0.0),
        COUNT(id)
    INTO 
        avg_rating,
        total_reviews
    FROM public.reviews
    WHERE property_id = target_property_id;

    -- Update property record
    UPDATE public.properties
    SET 
        rating = avg_rating,
        reviews_count = total_reviews,
        updated_at = timezone('utc'::text, now())
    WHERE id = target_property_id;

    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_property_rating_stats ON public.reviews;
CREATE TRIGGER trg_update_property_rating_stats
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_property_rating_stats();

-- 5. Automated Notification Dispatch for Booking Status Changes
CREATE OR REPLACE FUNCTION public.notify_booking_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    prop_title TEXT;
BEGIN
    IF OLD.status <> NEW.status THEN
        SELECT title INTO prop_title FROM public.properties WHERE id = NEW.property_id;

        -- Notify Student
        IF NEW.status = 'Confirmed' THEN
            INSERT INTO public.notifications (user_id, title, message, type, link_url)
            VALUES (
                NEW.student_id,
                'Tour Request Approved! 🎉',
                'Your visit for ' || COALESCE(prop_title, 'the property') || ' on ' || NEW.visit_date || ' (' || NEW.time_slot || ') was confirmed by the landlord.',
                'booking_confirmed',
                '/dashboard/student'
            );
        ELSIF NEW.status = 'Declined' THEN
            INSERT INTO public.notifications (user_id, title, message, type, link_url)
            VALUES (
                NEW.student_id,
                'Tour Request Declined',
                'Your visit request for ' || COALESCE(prop_title, 'the property') || ' on ' || NEW.visit_date || ' was declined. You can reschedule another available slot.',
                'booking_declined',
                '/dashboard/student'
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_booking_status ON public.bookings_visits;
CREATE TRIGGER trg_notify_booking_status
    AFTER UPDATE OF status ON public.bookings_visits
    FOR EACH ROW EXECUTE FUNCTION public.notify_booking_status_change();

-- 6. Verification Pipeline Automation (Auto-verify property when compliance docs are approved)
CREATE OR REPLACE FUNCTION public.handle_verification_approval()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF OLD.status <> NEW.status AND NEW.status = 'Approved' THEN
        -- If attached to a property, set property is_verified = TRUE
        IF NEW.property_id IS NOT NULL THEN
            UPDATE public.properties
            SET is_verified = TRUE
            WHERE id = NEW.property_id;
        END IF;

        -- Notify the owner
        INSERT INTO public.notifications (user_id, title, message, type, link_url)
        VALUES (
            NEW.owner_id,
            'Verification Approved! 🛡️',
            'Your document "' || NEW.document_name || '" has been approved by the safety team.',
            'verification_approved',
            '/dashboard/owner/listings'
        );
    ELSIF OLD.status <> NEW.status AND NEW.status = 'Rejected' THEN
        INSERT INTO public.notifications (user_id, title, message, type, link_url)
        VALUES (
            NEW.owner_id,
            'Verification Document Rejected',
            'Your document "' || NEW.document_name || '" requires re-submission: ' || COALESCE(NEW.rejection_reason, 'Invalid document format.'),
            'verification_rejected',
            '/dashboard/owner/listings'
        );
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_handle_verification_approval ON public.verification_documents;
CREATE TRIGGER trg_handle_verification_approval
    AFTER UPDATE OF status ON public.verification_documents
    FOR EACH ROW EXECUTE FUNCTION public.handle_verification_approval();
