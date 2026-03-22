import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminUser } from "@/lib/admin/require-admin";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, { params }: Props) {
  const authCheck = await requireAdminUser();
  if (!authCheck.ok) return authCheck.response;

  try {
    const { id } = await params;
    const body = await req.json();

    const {
      email,
      password,
      is_disabled,
    }: {
      email?: string;
      password?: string;
      is_disabled?: boolean;
    } = body;

    const updateData: {
      email?: string;
      password?: string;
      ban_duration?: string;
    } = {};

    if (email !== undefined && email !== "") {
      updateData.email = String(email).trim().toLowerCase();
    }

    if (password !== undefined && password !== "") {
      updateData.password = String(password);
    }

    if (typeof is_disabled === "boolean") {
      updateData.ban_duration = is_disabled ? "876000h" : "none";
    }

    const admin = createAdminClient();

    const { data, error } = await admin.auth.admin.updateUserById(id, updateData);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data.user });
  } catch {
    return NextResponse.json(
      { error: "Unable to update user." },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: Props) {
  const authCheck = await requireAdminUser();
  if (!authCheck.ok) return authCheck.response;

  try {
    const { id } = await params;
    const admin = createAdminClient();

    const { error } = await admin.auth.admin.deleteUser(id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete user." },
      { status: 500 }
    );
  }
}