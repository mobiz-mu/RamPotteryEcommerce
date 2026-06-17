import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function clean(value: unknown) {
  return String(value || "").trim();
}

async function verifyAdmin() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { error: "Not authenticated.", status: 401 };
  }

  const { data: adminProfile } = await admin
    .from("admin_profiles")
    .select("id, is_active")
    .eq("id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!adminProfile) {
    return { error: "Admin access required.", status: 403 };
  }

  return { user, admin };
}

export async function POST(req: Request) {
  try {
    const verified = await verifyAdmin();

    if ("error" in verified) {
      return NextResponse.json(
        { error: verified.error },
        { status: verified.status },
      );
    }

    const body = await req.json();

    const email = clean(body.email).toLowerCase();
    const password = String(body.password || "");
    const fullName = clean(body.fullName) || "Admin User";
    const role = clean(body.role) || "admin";

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 },
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 },
      );
    }

    const listResponse = await verified.admin.auth.admin.listUsers();
    const existingUser = listResponse.data.users.find(
      (user) => String(user.email || "").toLowerCase() === email,
    );

    let authUser = existingUser;

    if (existingUser) {
      const { data, error } = await verified.admin.auth.admin.updateUserById(
        existingUser.id,
        {
          password,
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
            role,
          },
          app_metadata: {
            role,
          },
        },
      );

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      authUser = data.user;
    } else {
      const { data, error } = await verified.admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          role,
        },
        app_metadata: {
          role,
        },
      });

      if (error || !data.user) {
        return NextResponse.json(
          { error: error?.message || "Could not create admin user." },
          { status: 500 },
        );
      }

      authUser = data.user;
    }

    const { error: profileError } = await verified.admin
      .from("admin_profiles")
      .upsert(
        {
          id: authUser.id,
          email,
          full_name: fullName,
          role,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Admin user created successfully.",
      user: {
        id: authUser.id,
        email,
        fullName,
        role,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Could not create admin user." },
      { status: 500 },
    );
  }
}