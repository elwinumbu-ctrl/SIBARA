import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Klien Supabase dengan hak akses "service role" (Admin API).
 *
 * PENTING: hanya boleh dipakai di kode sisi server (Route Handler atau
 * Server Component) — TIDAK PERNAH diimpor ke komponen client ("use
 * client"), karena kunci ini memiliki akses penuh ke seluruh data dan
 * melewati Row Level Security. Dipakai khusus untuk fitur admin utama
 * membuat akun pengguna baru (auth.admin.createUser).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY belum diatur di environment variable " +
        "server. Buka Supabase -> Project Settings -> API, salin nilai " +
        "'service_role', lalu tambahkan sebagai SUPABASE_SERVICE_ROLE_KEY " +
        "di .env.local (dan di pengaturan environment variable Vercel). " +
        "JANGAN beri awalan NEXT_PUBLIC_ pada variabel ini."
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
