import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client dengan service_role key -- BYPASS Row Level Security.
 *
 * PERINGATAN: hanya boleh dipakai di server (Route Handler / Server
 * Action), TIDAK PERNAH diimpor ke Client Component. Paket "server-only"
 * di atas akan membuat build gagal kalau file ini ke-import ke bundle
 * browser, sebagai pengaman tambahan.
 *
 * Dipakai khusus untuk operasi admin: membuat akun pengguna baru,
 * mengubah role, menonaktifkan, atau menghapus pengguna lain --
 * hal-hal yang tidak boleh dilakukan lewat client biasa.
 */
export function createAdminSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
