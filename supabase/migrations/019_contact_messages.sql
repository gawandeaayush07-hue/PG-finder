-- =====================================================================
-- Migration: 019_contact_messages.sql
-- Description: Stores messages sent through the public Contact form.
--              Visitors can only ADD messages through the website's server
--              route; nobody can read them except the server (service_role),
--              which the admin Messages page uses.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id   TEXT NOT NULL UNIQUE,
    name        TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 80),
    email       TEXT NOT NULL CHECK (char_length(email) BETWEEN 5 AND 254),
    category    TEXT NOT NULL CHECK (category IN (
                    'student_inquiry',
                    'owner_listing',
                    'technical_bug',
                    'billing_deposit',
                    'press_partnership'
                )),
    message     TEXT NOT NULL CHECK (char_length(message) BETWEEN 10 AND 2000),
    status      TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'DONE')),
    email_sent  BOOLEAN NOT NULL DEFAULT FALSE,
    ip_hash     TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    handled_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status_created
    ON public.contact_messages (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_ip_created
    ON public.contact_messages (ip_hash, created_at DESC);

-- Lock the table down: RLS on, no policies, only service_role may use it
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.contact_messages FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.contact_messages TO service_role;
