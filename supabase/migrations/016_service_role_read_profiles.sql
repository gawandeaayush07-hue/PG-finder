-- 016: let the server-side signup route check for duplicate phone numbers (read-only)
GRANT SELECT ON public.profiles TO service_role;
