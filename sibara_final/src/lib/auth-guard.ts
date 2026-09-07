import "server-only";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "./supabase/server";

export type CurrentUser = {
  id: string;
  email: string | null;
  nama: string;
  role: "admin" | "staff";
  aktif: boolean;
};

/**
 * Ambil user yang sedang login beserta profil (nama, role, aktif).
 * Mengembalikan null kalau belum login atau profil tidak ditemukan.
 *
 * CATATAN INTEGRASI: kalau project ini pakai sistem auth custom (bukan
 * Supabase Auth), ganti isi fungsi ini agar membaca sesi dari sistem
 * auth kamu, lalu tetap kembalikan bentuk CurrentUser di atas -- semua
 * kode lain (halaman & API route) tidak perlu diubah.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("nama, role, aktif")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    id: user.id,
    email: user.email ?? null,
    nama: profile.nama,
    role: profile.role,
    aktif: profile.aktif,
  };
}

/**
 * Dipanggil di awal Server Component halaman yang khusus admin
 * (mis. /pengguna). Redirect ke /login kalau belum login, atau ke
 * /dashboard kalau login tapi bukan admin / akun nonaktif.
 */
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/pengguna");
  }

  if (!user.aktif || user.role !== "admin") {
    redirect("/dashboard");
  }

  return user;
}
