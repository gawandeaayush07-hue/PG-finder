-- =====================================================================
-- Migration: 017_password_recovery.sql
-- Description: Tables for self-service password recovery (recovery code +
--              security question) and admin-assisted reset requests.
--              Only the server (service_role) can touch these tables.
-- =====================================================================

-- 1. Recovery details chosen at signup (secrets are stored HASHED only)
CREATE TABLE IF NOT EXISTS public.account_recovery (
    user_id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    code_hash       TEXT NOT NULL,
    question_key    TEXT NOT NULL,
    answer_hash     TEXT NOT NULL,
    failed_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. "Ask the admin" requests and the one-time codes the admin issues
CREATE TABLE IF NOT EXISTS public.password_reset_requests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    phone           TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'PENDING'
                    CHECK (status IN ('PENDING', 'CODE_ISSUED', 'COMPLETED', 'CANCELLED', 'EXPIRED')),
    code_hash       TEXT,
    code_expires_at TIMESTAMPTZ,
    failed_attempts INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    issued_at       TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_password_reset_requests_user
    ON public.password_reset_requests (user_id, status);
CREATE INDEX IF NOT EXISTS idx_password_reset_requests_status
    ON public.password_reset_requests (status, created_at DESC);

-- 3. Lock both tables down: RLS on, no policies, only service_role may use them
ALTER TABLE public.account_recovery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_requests ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.account_recovery FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.password_reset_requests FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.account_recovery TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.password_reset_requests TO service_role;

-- 4. After a password reset, end all other logins of that account.
--    Callable by the server only.
CREATE OR REPLACE FUNCTION public.revoke_user_sessions(target_user UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    DELETE FROM auth.sessions WHERE user_id = target_user;
END;
$$;

REVOKE ALL ON FUNCTION public.revoke_user_sessions(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_user_sessions(UUID) TO service_role;
