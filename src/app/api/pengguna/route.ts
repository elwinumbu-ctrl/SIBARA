import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-guard";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

/**
 * GET /api/pengguna
 * Daftar semua pengguna (gabungan data auth.users + profiles).
 * Hanya admin aktif yang boleh mengakses.
 */
export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin" || !currentUser.aktif) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }

  const admin = createAdminSupabaseClient();

  const { data: profiles, error: profilesError } = await admin
    .from("profiles")
    .select("id, nama, role, aktif, created_at")
    .order("created_at", { ascending: false });

  if (profilesError) {
    return NextResponse.json({ error: profilesError.message }, { status: 500 });
  }

  // Ambil email dari auth.users lewat Admin API (email tidak disimpan di
  // tabel profiles supaya tidak duplikat sumber data).
  const { data: authList, error: authError } =
    await admin.auth.admin.listUsers({ perPage: 1000 });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  const emailById = new Map(authList.users.map((u) => [u.id, u.email]));

  const pengguna = profiles.map((p) => ({
    ...p,
    email: emailById.get(p.id) ?? null,
  }));

  return NextResponse.json({ pengguna });
}

/**
 * POST /api/pengguna
 * Body: { nama: string, email: string, password: string, role: "admin" | "staff" }
 * Membuat akun pengguna baru. Hanya admin aktif yang boleh mengakses.
 */
export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin" || !currentUser.aktif) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }

  const body = await request.json();
  const { nama, email, password, role } = body as {
    nama?: string;
    email?: string;
    password?: string;
    role?: string;
  };

  if (!nama || !email || !password) {
    return NextResponse.json(
      { error: "Nama, email, dan password wajib diisi." },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password minimal 8 karakter." },
      { status: 400 }
    );
  }
  const finalRole = role === "admin" ? "admin" : "staff";

  const admin = createAdminSupabaseClient();

  const { data: created, error: createError } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nama, role: finalRole },
    });

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 400 });
  }

  // Trigger on_auth_user_created sudah membuat baris profiles dengan role
  // default 'staff'; pastikan role sesuai pilihan admin (mis. kalau admin
  // memilih 'admin' langsung saat membuat akun).
  const { error: updateRoleError } = await admin
    .from("profiles")
    .update({ nama, role: finalRole })
    .eq("id", created.user.id);

  if (updateRoleError) {
    return NextResponse.json(
      { error: updateRoleError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, id: created.user.id }, { status: 201 });
}
