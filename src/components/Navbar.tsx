"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Navbar({ email }: { email?: string }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-paper-line bg-paper-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-ink text-paper-card font-display text-sm">
            SB
          </span>
          <span>
            <span className="block font-display text-base text-ink leading-none">
              SIBARA
            </span>
            <span className="block text-[11px] text-slate-muted leading-none mt-0.5">
              Bank Regulasi Dana BOSP
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/regulasi/baru"
            className="hidden sm:inline-flex items-center rounded-md bg-ink text-paper-card text-sm font-medium px-3.5 py-2 hover:bg-ink-light transition-colors"
          >
            + Tambah Regulasi
          </Link>
          {email && (
            <span className="hidden md:block text-xs text-slate-muted">
              {email}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-slate-muted hover:text-ink transition-colors"
          >
            Keluar
          </button>
        </div>
      </div>
    </header>
  );
}
