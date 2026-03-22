import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminUser } from "@/lib/admin/require-admin";

export async function GET() {
  const authCheck = await requireAdminUser();
  if (!authCheck.ok) return authCheck.response;

  try {
    const admin = createAdminClient();

    const { data, error } = await admin.auth.admin.listUsers();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const users =
      data.users?.map((user) => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        email_confirmed_at: user.email_confirmed_at,
        banned_until: user.banned_until,
        is_disabled: !!user.banned_until,
      })) ?? [];

    return NextResponse.json({ data: users });
  } catch {
    return NextResponse.json(
      { error: "Unable to load admin users." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const authCheck = await requireAdminUser();
  if (!authCheck.ok) return authCheck.response;

  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    const { data, error } = await admin.auth.admin.createUser({
      email: String(email).trim().toLowerCase(),
      password: String(password),
      email_confirm: true,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data.user });
  } catch {
    return NextResponse.json(
      { error: "Unable to create user." },
      { status: 500 }
    );
  }
}