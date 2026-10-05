# Authentication Architecture Documentation (Phase 2)

**Application:** PGFinder (Student PG Accommodation Platform)  
**Authentication Provider:** Supabase Auth (GoTrue) + `@supabase/ssr`  
**Status:** Completed Phase 2 Production Integration  
**Date:** September 2026  

---

## 1. Executive Architecture Overview

In Phase 2, PGFinder transitions from an insecure client-side mock authentication model (relying on `localStorage.getItem('pgfinder_persona_role')` and arbitrary role-switching) to a **production-grade, cryptographically verified Supabase SSR authentication architecture**.

### Core Architecture Principles:
1. **Supabase `auth.users` is the sole authentication source.** Identity, passwords, sessions, and JWTs reside exclusively within Supabase Auth.
2. **`public.profiles` is the sole authorization source.** Application permissions, roles (`STUDENT`, `OWNER`, `ADMIN`), full names, phone numbers, and college affiliations are persisted in `public.profiles` linked directly to `auth.users.id` (`ON DELETE CASCADE`).
3. **Cookie-Based SSR Session Handling.** Authentication tokens are stored strictly in secure HTTP cookies handled via `@supabase/ssr` rather than browser `localStorage`.
4. **Network Boundary Route Protection.** Middleware (`src/middleware.ts` & `src/lib/supabase/middleware.ts`) and layout guards enforce server-side security checks before protected dashboard content is rendered.
5. **Zero Client Elevation to ADMIN.** The client interface and signup forms can only create `STUDENT` or `OWNER` accounts. Database triggers and RLS policies prevent client self-assignment of `ADMIN`.

---

## 2. Supabase Auth ↔ Profiles Relationship

```
 ┌────────────────────────────────────────────────────────┐
 │                   Supabase Auth                        │
 │                  (auth.users)                          │
 │  - id (UUID)                                           │
 │  - email (TEXT)                                        │
 │  - encrypted_password                                  │
 │  - user_metadata: { role: 'STUDENT'|'OWNER', ... }    │
 └───────────────────────────┬────────────────────────────┘
                             │
            PostgreSQL Trigger (004_triggers_and_functions.sql)
            handle_new_user() executes on INSERT
                             │
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │                 Application Profile                    │
 │                  (public.profiles)                     │
 │  - id (UUID, PK -> auth.users.id)                      │
 │  - email (TEXT, UNIQUE)                                │
 │  - full_name (TEXT)                                    │
 │  - phone (TEXT, NULL)                                  │
 │  - role (user_role ENUM: 'STUDENT' | 'OWNER' | 'ADMIN')│
 │  - college_name (TEXT, NULL)                           │
 │  - is_verified (BOOLEAN)                               │
 │  - created_at / updated_at                             │
 └────────────────────────────────────────────────────────┘
```

### Profile Provisioning Security
When a user signs up via `supabase.auth.signUp()`, the database trigger `trg_auth_user_created` fires `handle_new_user()`.
- If `raw_user_meta_data->>'role'` equals `'ADMIN'`, the trigger **overrides** and forcibly coerces the role to `'STUDENT'`.
- Only authorized database administrators or Supabase Dashboard operators can elevate a profile to `'ADMIN'`.

---

## 3. Role-Based Access Control (RBAC) Matrix

| Persona / Role | Discover & Search (`/`, `/search`, `/listings/[id]`) | Student Portal (`/dashboard/student/*`) | Owner Portal (`/dashboard/owner/*`) | Admin Portal (`/dashboard/admin/*`) |
| :--- | :---: | :---: | :---: | :---: |
| **GUEST** (Unauthenticated) | ✅ Public Access | ❌ Blocked (Redirect to `/auth`) | ❌ Blocked (Redirect to `/auth`) | ❌ Blocked (Redirect to `/auth`) |
| **STUDENT** | ✅ Allowed | ✅ Full Access | ❌ Blocked (Redirect to `/dashboard/student`) | ❌ Blocked (Redirect to `/dashboard/student`) |
| **OWNER** | ✅ Allowed | ❌ Blocked (Redirect to `/dashboard/owner`) | ✅ Full Access | ❌ Blocked (Redirect to `/dashboard/owner`) |
| **ADMIN** | ✅ Full Access | ✅ Supervisor Access | ✅ Supervisor Access | ✅ Full Administrative Access |

---

## 4. Next.js App Router Client & Server Architecture

### 4.1 Client Component Utility (`src/lib/supabase/client.ts`)
- Utilizes `createBrowserClient` from `@supabase/ssr`.
- Safely instantiated in client components (`usePersona()`, `AuthPage`, `AuthModal`).
- Uses browser cookies with automatic cookie encoding/decoding.

### 4.2 Server Component Utility (`src/lib/supabase/server.ts`)
- Utilizes `createServerClient` from `@supabase/ssr`.
- Invokes `await cookies()` (as mandated by Next.js 15+ and 16 App Router).
- Handles reading incoming session cookies and propagating refreshed cookies back to outgoing headers.

### 4.3 Proxy / Middleware Boundary (`src/middleware.ts` & `src/lib/supabase/middleware.ts`)
- Runs ahead of page rendering.
- Performs session token refresh against Supabase Auth.
- Validates the user token with `supabase.auth.getUser()`.
- Inspects `public.profiles.role` to authorize route segments (`/dashboard/student`, `/dashboard/owner`, `/dashboard/admin`).
- Gracefully permits fallback mode when placeholder environment variables are detected during local development.

---

## 5. PersonaContext Refactoring

The previous `PersonaContext.tsx` managed mock authentication state via `localStorage.getItem('pgfinder_persona_role')`. It has been refactored as follows:
- **`user` State:** Reflects `User | null` from Supabase Auth.
- **`profile` State:** Reflects the authoritative `public.profiles` row.
- **`role` State:** Synchronized with `profile.role` (or `'GUEST'` when signed out).
- **`isAdminAuthorized` State:** Verified strictly against `profile.role === 'ADMIN'`.
- **`isLoadingAuth` State:** Prevents layout/dashboard flickering while session status is actively resolving.
- **`logout()` Function:** Calls `supabase.auth.signOut()` to invalidate session tokens and wipe session cookies.
- **Preserved Properties & Handlers:** `listings`, `shortlist`, `bookings`, `verificationPipeline`, `reports`, `searchQuery`, and `priceRange` are preserved in context to ensure zero regressions across existing components.

---

## 6. Environment Variables Specification

The system requires the following environment variables:

```bash
# Client-Safe Variables (Exposed to Browser)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server-Only Variable (CRITICAL: Never expose to browser or Git)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

An example template is maintained in [.env.example](file:///c:/PG%20finder/.env.example). Real credentials should only be placed in `.env.local`, which is ignored by `.gitignore`.

---

## 7. Security Hardening & Audit Checklist

- [x] **No Manual Storage of Tokens:** Access tokens and refresh tokens are managed by `@supabase/ssr` cookies; no sensitive JWTs are saved in `localStorage`.
- [x] **No Hardcoded Secrets:** Credentials use environment variables with fallback safe mode for builds.
- [x] **Zero Client Admin Creation:** Signup form limits role choice strictly to `STUDENT` or `OWNER`. Database triggers prevent elevation to `ADMIN`.
- [x] **Server-Side Authorization:** Middleware and layout guards prevent unauthenticated or unauthorized role access to `/dashboard/*`.
- [x] **Strict Row Level Security:** Policies in `002_rls_policies.sql` and `006_security_and_integrity_fixes.sql` restrict update access on `public.profiles` so regular users cannot mutate their own `role` column.

---

## 8. Remaining Authentication Enhancements (Phase 2 Follow-Ups)

1. **Email Verification Link Callback Route (`/auth/callback`):** When email confirmation is turned ON in Supabase project settings, a route handler exchanging auth code for session cookies will be linked.
2. **Password Reset Screens (`/auth/forgot-password`, `/auth/reset-password`):** Can be introduced when dedicated reset UX is designed.
3. **OAuth Providers (Google, Apple):** Supabase Auth supports Google One-Tap/OAuth. Can be activated once client ID/secret are provisioned.
