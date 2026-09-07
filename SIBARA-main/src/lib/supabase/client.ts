"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client untuk dipakai di Client Component (browser).
 * Pakai anon key -- aman diekspos ke browser, akses data tetap
 * dibatasi oleh Row Level Security di database.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
