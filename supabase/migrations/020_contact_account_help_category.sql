-- =====================================================================
-- Migration: 020_contact_account_help_category.sql
-- Description: Adds the "Account / Password Help" category to contact_messages.
--              Drops the old category CHECK by looking it up (so it works whatever
--              name Postgres gave it) and adds a new one with six categories.
-- =====================================================================

DO $$
DECLARE
    c RECORD;
BEGIN
    FOR c IN
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'public.contact_messages'::regclass
          AND contype = 'c'
          AND pg_get_constraintdef(oid) LIKE '%student_inquiry%'
    LOOP
        EXECUTE format('ALTER TABLE public.contact_messages DROP CONSTRAINT %I', c.conname);
    END LOOP;
END;
$$;

ALTER TABLE public.contact_messages
    ADD CONSTRAINT contact_messages_category_check CHECK (category IN (
        'student_inquiry',
        'owner_listing',
        'technical_bug',
        'billing_deposit',
        'press_partnership',
        'account_help'
    ));
