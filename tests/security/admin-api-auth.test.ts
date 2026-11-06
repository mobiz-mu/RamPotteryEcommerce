/**
 * Security regression test: every handler under src/app/api/admin must reject
 * (401/403) anonymous users AND signed-in non-admin customers, and must not
 * touch any data table with the service-role client before authorising.
 *
 * New admin routes are discovered automatically, so a route added without an
 * auth check fails this test.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

type Session = "anonymous" | "customer";
const state = { session: "anonymous" as Session, violations: [] as string[] };

// Chainable query stub: admin_profiles lookups resolve to "no profile";
// anything else is a violation (data touched before authorisation).
function query(table: string, client = "service-role") {
  const allowed = table === "admin_profiles";
  if (!allowed) state.violations.push(`${client} access to "${table}" before auth`);
  const result = { data: null, error: allowed ? null : { message: "blocked by test" }, count: 0 };
  const chain: Record<string, unknown> = {};
  const self = () => chain;
  for (const m of ["select", "eq", "neq", "in", "is", "order", "limit", "range", "ilike", "or", "insert", "update", "delete", "upsert"]) chain[m] = self;
  chain.maybeSingle = async () => result;
  chain.single = async () => result;
  chain.then = (res: (v: unknown) => unknown) => Promise.resolve(result).then(res);
  return chain;
}

const forbidden = (what: string) => () => {
  state.violations.push(what);
  throw new Error(`blocked: ${what}`);
};

const serviceClient = {
  from: (t: string) => query(t),
  rpc: forbidden("service-role rpc before auth"),
  storage: { from: forbidden("service-role storage before auth") },
  auth: { admin: new Proxy({}, { get: () => forbidden("service-role auth.admin before auth") }) },
};

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn(), revalidateTag: vi.fn() }));
vi.mock("@/lib/supabase/admin", () => ({ supabaseAdmin: serviceClient, createAdminClient: () => serviceClient }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: {
      getUser: async () => ({
        data: { user: state.session === "customer" ? { id: "11111111-1111-4111-8111-111111111111", email: "customer@example.com" } : null },
        error: null,
      }),
    },
    // User-scoped (RLS) client: must also not be used for data before auth.
    from: (t: string) => query(t, "user-session (RLS)"),
    storage: { from: forbidden("user storage before auth") },
  }),
}));

const ADMIN_API = process.env.RP_ADMIN_API_DIR || join(process.cwd(), "src", "app", "api", "admin");
function routeFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? routeFiles(full) : name === "route.ts" ? [full] : [];
  });
}

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;
const ID = "22222222-2222-4222-8222-222222222222";
const cases: Array<{ route: string; method: string; handler: (...a: unknown[]) => Promise<Response> }> = [];

beforeAll(async () => {
  for (const file of routeFiles(ADMIN_API)) {
    const mod = (await import(/* @vite-ignore */ file)) as Record<string, unknown>;
    const route = "/" + relative(join(ADMIN_API, "..", ".."), file).split(sep).slice(0, -1).join("/");
    for (const m of METHODS) if (typeof mod[m] === "function") cases.push({ route, method: m, handler: mod[m] as never });
  }
});

afterEach(() => {
  state.violations = [];
});

describe("admin API authorisation", () => {
  it("discovers admin route handlers", () => {
    expect(cases.length).toBeGreaterThanOrEqual(20);
  });

  for (const session of ["anonymous", "customer"] as const) {
    it(`rejects every handler for ${session} users without touching data`, async () => {
      state.session = session;
      const failures: string[] = [];
      for (const c of cases) {
        state.violations = [];
        const body = c.method === "GET" ? undefined : JSON.stringify({ title: "x", status: "paid", action: "archive", confirmSlug: "x" });
        const req = new Request(`http://localhost${c.route.replace(/\[id\]/g, ID)}`, {
          method: c.method,
          headers: { "content-type": "application/json" },
          body,
        });
        let status = 0;
        try {
          const res = await c.handler(req, { params: Promise.resolve({ id: ID }) });
          status = res.status;
        } catch (e) {
          failures.push(`${c.method} ${c.route}: threw ${(e as Error).message}`);
          continue;
        }
        if (status !== 401 && status !== 403) failures.push(`${c.method} ${c.route}: HTTP ${status}`);
        if (state.violations.length) failures.push(`${c.method} ${c.route}: ${state.violations.join("; ")}`);
      }
      expect(failures).toEqual([]);
    });
  }
});
