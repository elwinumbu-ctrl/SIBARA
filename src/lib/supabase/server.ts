import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client untuk dipakai di Server Component / Route Handler.
 * Membaca sesi user dari cookie, sehingga tahu "siapa yang sedang login"
 * dan tunduk pada RLS sesuai user tersebut (BUKAN admin/service_role).
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Dipanggil dari Server Component (bukan Route Handler/middleware);
            // boleh diabaikan selama ada middleware yang me-refresh sesi.
          }
        },
      },
    }
  );
}
