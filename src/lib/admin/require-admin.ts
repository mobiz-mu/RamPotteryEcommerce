import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_ADMIN_IDS = [
  "6e08d3af-4698-475b-a769-f11bfb7cbddc",
];

export async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!ALLOWED_ADMIN_IDS.includes(user.id)) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    ok: true as const,
    user,
  };
}