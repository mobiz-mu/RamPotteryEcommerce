# Admin API authorisation hardening

This change enforces administrator authorisation **at the API layer** for every route under `/api/admin`. It complements the existing checks in the admin interface.

## What changed
- `src/lib/admin/session.ts` adds `requireAdminApi()`.
  - It verifies the signed-in session on the server.
  - It requires an **active administrator profile**, the same rule the admin interface already uses.
  - It returns 401 or 403 otherwise.
- `requireAdminApi()` is the first statement of each admin route handler, before any data access.
- `src/lib/supabase/admin.ts` is marked `server-only`, so the privileged client can't be bundled into browser code.
- A regression test (`tests/security/admin-api-auth.test.ts`):
  - discovers every admin route handler automatically;
  - checks that anonymous and signed-in non-admin users are rejected;
  - checks that no data is accessed before authorisation.

## Verification
- `npx tsc --noEmit`: pass
- `npx vitest run`: pass (3/3)
- `next build`: pass
- ESLint (`src` and `tests`): 53 errors and 15 warnings, all pre-existing. `main` has the identical counts file by file; this change adds none.

## Impact
- Storefront: no change.
- Administrators: no change.
- Requests to `/api/admin/*` without an active administrator session are rejected with 401/403.
- No database, schema or environment-variable changes.

## Rollback
- Promote the previous production deployment in Vercel, or `git revert -m 1 <merge-commit>`.
- There is no data or schema change to undo.
