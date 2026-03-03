# Security Remediation Plan — Pre-Deployment Fixes

## Context
The Supabase anon key was compromised and has been rotated. A comprehensive security audit identified 13+ vulnerabilities that must be fixed before deploying to GitHub/Netlify. This plan covers all critical, high, and medium severity fixes in priority order.

## Fix 1: Role Escalation in User Sync Trigger (CRITICAL)

**Problem:** `sync_user_metadata()` in migration 029 reads `role` from user-controllable `raw_user_meta_data` and writes it to `public.users.role`. A user can sign up with `role: "admin"` and become an admin.

**File:** `supabase/migrations/029_fix_user_sync_trigger.sql` (lines 16-28)

**Fix:** Create a new migration `supabase/migrations/054_fix_role_escalation.sql` that:
- Replaces `sync_user_metadata()` to ONLY allow safe roles: `jobseeker`, `intern`, `educator`, `partner`
- Removes `'admin' THEN 'admin'` from the CASE statement — admin role must ONLY be assigned via `app_metadata` by a super admin
- Adds a separate check: if `raw_app_meta_data->>'role'` is set (server-side only), use that; otherwise default to the safe CASE mapping

## Fix 2: Scrub .env from Git History (CRITICAL)

**Problem:** `.env` with real Supabase URL, old anon key, and BLS API key was committed in `0f5466de`. Even though the key is rotated, the BLS key and Supabase URL remain exposed. Must scrub before pushing to GitHub.

**Action:** Use `git filter-repo` (preferred over BFG for single-file removal):
```bash
pip3 install git-filter-repo
git filter-repo --invert-paths --path .env --path .env.production --force
```
This rewrites history to remove all traces of `.env` and `.env.production`. After this, commit the current clean state and proceed.

**Note:** This rewrites all commit hashes. Since we haven't pushed to GitHub yet, this is safe.

## Fix 3: Move Demo Credentials Out of Frontend (HIGH)

**Problem:** `src/contexts/DemoContext.tsx` (lines 31-77) hardcodes 9 demo account emails and the shared password `DemoAccount2025!` directly in frontend JavaScript — visible to anyone who opens browser DevTools.

**File:** `src/contexts/DemoContext.tsx`

**Fix:**
- Remove the `password` field from `DEMO_ACCOUNTS` — keep only `email` and `route`
- Move the demo password to a Supabase Edge Function: `supabase/functions/demo-login/index.ts`
  - Accepts `{ role: "employer" }`
  - Looks up the demo email for that role
  - Calls `supabase.auth.signInWithPassword()` server-side using the password from an env var `DEMO_PASSWORD`
  - Returns the session tokens to the client
- Update `DemoContext.tsx` `enterDemo()` and `switchRole()` to call the edge function instead of signing in directly
- Set `DEMO_PASSWORD` as a Supabase Edge Function secret (not in frontend code)

## Fix 4: Compliance Gates — Move from user_metadata to app_metadata (HIGH)

**Problem:** `src/components/common/ProtectedPortalRoute.tsx` (lines 156-196) checks `user_metadata` for HIPAA/FERPA compliance flags (`npi_verified`, `baa_acknowledged`, `ferpa_training_complete`, `dua_acknowledged`). Users can set their own `user_metadata` via `supabase.auth.updateUser()`, bypassing these gates.

**File:** `src/components/common/ProtectedPortalRoute.tsx`

**Fix:**
- Change lines 156-196 to read from `user.app_metadata` instead of `user.user_metadata`
- `app_metadata` can only be set server-side via the service role key, making it tamper-proof
- Ensure any existing compliance verification flows write to `app_metadata` (via an edge function, not client-side)

## Fix 5: Enable RLS on Unprotected Tables (HIGH)

**Problem:** Multiple tables across migrations lack `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`. The `data_retention_schedule` table in migration 051 is one confirmed example. There may be others across newer migrations (039-052).

**File:** New migration `supabase/migrations/055_enable_missing_rls.sql`

**Fix:** Create a migration that:
- Runs `ALTER TABLE <table> ENABLE ROW LEVEL SECURITY` for every table missing it
- Adds a default-deny policy (`USING (false)`) as a safety net for tables without specific policies
- Then adds appropriate policies (e.g., `service_role` access for admin tables, user-scoped access for user tables)

**Tables to audit and enable RLS on** (from migrations 039-052):
- `data_retention_schedule` (051)
- All tables in: 039 (clearance/ITAR/fellowship), 041 (school counselor, staff management), 042 (eligibility workflows, state workforce), 043-048 (partner systems), 049 (workforce data cache), 050 (performance indexes), 052 (workforce occupation cache)

## Fix 6: Add Auth to Edge Functions (HIGH)

**Problem:** 7 of the edge functions accept requests without validating the Authorization header/JWT. Anyone with the function URL can invoke them.

**Files:** All `supabase/functions/*/index.ts`:
- `federation-sync` — no auth
- `award-letter-analyzer` — no auth, accepts spoofable `user_id`
- `scholarship-matcher` — no auth
- `career-roi-calculator` — no auth
- `college-matcher` — no auth
- `net-price-calculator` — no auth
- `loan-calculator` — no auth
- `submit-partner-application` — no auth

**Fix:** Add a shared auth helper pattern to each function:
```typescript
const authHeader = req.headers.get('Authorization');
if (!authHeader) return new Response('Unauthorized', { status: 401 });
const { data: { user }, error } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
if (error || !user) return new Response('Unauthorized', { status: 401 });
```
For `federation-sync` (server-to-server), validate against a shared secret or service role key instead of user JWT.

## Fix 7: GDPR Deletion — Cover Student Tables (MEDIUM)

**Problem:** `process_deletion_request()` in `supabase/migrations/051_gdpr_compliance.sql` (lines 226-291) doesn't delete data from 7 student-specific tables.

**File:** New migration `supabase/migrations/056_fix_gdpr_deletion.sql`

**Fix:** Add DELETE/anonymization statements for:
- `student_profiles` — anonymize PII fields
- `saved_scholarships` — delete
- `saved_colleges` — delete
- `award_letters` — delete (FERPA-sensitive)
- `student_loans` — delete
- `college_applications` — delete (contains portal credentials)
- `scholarship_matches` — delete

## Fix 8: FERPA Audit Logs — Remove from SessionStorage (MEDIUM)

**Problem:** `src/components/pages/counselor/CounselorDashboard.tsx` (lines 377-379) stores FERPA audit logs in browser `sessionStorage`. This is a compliance violation — audit logs must be immutable and server-side.

**File:** `src/components/pages/counselor/CounselorDashboard.tsx`

**Fix:**
- Remove lines 376-379 (sessionStorage reads/writes)
- Replace with a Supabase insert to an `audit_logs` table (which already exists in the schema)
- If offline/error, fail silently but log to console — never store PII in browser storage

## Fix 9: COPPA Age Gate on Registration (MEDIUM)

**Problem:** `src/components/pages/RegisterPage.tsx` has no date of birth field or age verification. The platform serves high school students (minors under 18, potentially under 13).

**File:** `src/components/pages/RegisterPage.tsx`

**Fix:**
- Add a date of birth field to the registration form
- If age < 13: block registration entirely (COPPA requires verifiable parental consent which is complex to implement)
- If age 13-17: show a notice that parental consent may be required, store a flag `is_minor: true` in `app_metadata`
- For the investor demo, this can be a simple date picker + age check — full COPPA compliance can follow later

## Fix 10: Clean Demo Account Passwords from Migrations (LOW)

**Problem:** `supabase/migrations/053_demo_accounts.sql` and `042_test_accounts.sql` contain plaintext passwords in SQL comments and values.

**Files:** Both migration files

**Fix:**
- Remove plaintext password references from SQL comments
- The actual `encrypted_password` field uses bcrypt (fine to keep), but remove any `-- password: DemoAccount2025!` comments
- This prevents leaking passwords if migrations are shared or committed

## Verification

1. **Role escalation:** Register a new user with `role: "admin"` in metadata → should get `jobseeker` instead
2. **Git history:** Run `git log --all -- .env` → should return nothing
3. **Demo login:** Click demo role on `/demo` page → should work via edge function, password not visible in browser network tab
4. **Compliance gates:** Try `supabase.auth.updateUser({ data: { npi_verified: true }})` → should NOT grant healthcare portal access
5. **Edge functions:** Call any function without Authorization header → should get 401
6. **GDPR deletion:** Submit deletion request for a user with student data → all 7 student tables should be cleaned
7. **Registration:** Try registering with DOB under 13 → should be blocked
8. **Build:** `npm run build` succeeds with no TypeScript errors
