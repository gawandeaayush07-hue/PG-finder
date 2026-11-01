-- =====================================================================
-- Migration: 015_phone_auth.sql
-- Description: Add contact_email and contact_email_verified columns to profiles,
--              enforce unique partial index on profiles.phone, and update
--              the handle_new_user() trigger to store phone, college, and
--              contact_email from signup metadata.
-- =====================================================================

-- 1. Add contact_email and contact_email_verified columns to profiles
ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS contact_email TEXT;

ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS contact_email_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Unique partial index on phone (ensures one account per mobile number)
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_phone_unique 
    ON public.profiles(phone) 
    WHERE phone IS NOT NULL;

-- 3. Update handle_new_user() trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_name          TEXT;
    user_phone         TEXT;
    user_college       TEXT;
    user_contact_email TEXT;
    assigned_role      public.user_role;
    raw_role           TEXT;
BEGIN
    -- Determine role from user metadata (strictly STUDENT or OWNER; default STUDENT)
    raw_role := NEW.raw_user_meta_data->>'role';

    IF raw_role = 'OWNER' THEN
        assigned_role := 'OWNER'::public.user_role;
    ELSE
        -- Default to STUDENT; never allow ADMIN self-registration
        assigned_role := 'STUDENT'::public.user_role;
    END IF;

    -- Extract full name with fallbacks
    user_name := COALESCE(
        NULLIF(trim(NEW.raw_user_meta_data->>'full_name'), ''),
        NULLIF(trim(NEW.raw_user_meta_data->>'name'), ''),
        'Student'
    );

    -- Extract phone, college, and optional contact email
    user_phone := NULLIF(trim(NEW.raw_user_meta_data->>'phone'), '');
    user_college := NULLIF(trim(NEW.raw_user_meta_data->>'college_name'), '');
    user_contact_email := NULLIF(trim(lower(NEW.raw_user_meta_data->>'contact_email')), '');

    -- Insert into public.profiles
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        phone,
        role,
        avatar_url,
        college_name,
        contact_email,
        contact_email_verified,
        is_verified
    ) VALUES (
        NEW.id,
        NEW.email,
        user_name,
        user_phone,
        assigned_role,
        NEW.raw_user_meta_data->>'avatar_url',
        user_college,
        user_contact_email,
        FALSE,
        FALSE
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
        contact_email = COALESCE(EXCLUDED.contact_email, public.profiles.contact_email);

    RETURN NEW;
END;
$$;

