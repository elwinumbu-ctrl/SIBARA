import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-guard";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

/**
 * PATCH /api/pengguna/:id
 * Body (semua opsional): { nama?, role?: "admin" | "staff", aktif?: boolean }
 * Mengubah data pengguna lain. Hanya admin aktif yang boleh mengakses.
 * Admin tidak boleh menonaktifkan/menurunkan role dirinya sendiri lewat
 * endpoint ini, supaya tidak ada kondisi "tidak ada admin aktif tersisa"
 * secara tidak sengaja.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin" || !currentUser.aktif) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }

  if (id === currentUser.id) {
    return NextResponse.json(
      { error: "Tidak bisa mengubah role/status akun sendiri di sini." },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { nama, role, aktif } = body as {
    nama?: string;
    role?: string;
    aktif?: boolean;
  };

  const updates: Record<string, unknown> = {};
  if (typeof nama === "string" && nama.trim()) updates.nama = nama.trim();
  if (role === "admin" || role === "staff") updates.role = role;
  if (typeof aktif === "boolean") updates.aktif = aktif;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Tidak ada data untuk diubah." },
      { status: 400 }
    );
  }

  const admin = createAdminSupabaseClient();
  const { error } = await admin.from("profiles").update(updates).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

/**
 * DELETE /api/pengguna/:id
 * Menghapus akun pengguna (auth.users + profiles lewat cascade).
 * Hanya admin aktif yang boleh mengakses; tidak bisa menghapus diri sendiri.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin" || !currentUser.aktif) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }

  if (id === currentUser.id) {
    return NextResponse.json(
      { error: "Tidak bisa menghapus akun sendiri." },
      { status: 400 }
    );
  }

  const admin = createAdminSupabaseClient();
  const { error } = await admin.auth.admin.deleteUser(id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
