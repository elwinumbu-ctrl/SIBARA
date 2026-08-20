"use client";

import Link from "next/link";
import Image from "next/image";
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

  const initials =
    email
      ?.split("@")[0]
      ?.slice(0, 2)
      .toUpperCase() ?? "??";

  return (
    <header className="sticky top-0 z-20 border-b border-paper-line bg-paper-card/90 backdrop-blur supports-[backdrop-filter]:bg-paper-card/75">
      <div className="h-1 bg-gradient-to-r from-ink via-seal to-ink" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-white ring-1 ring-paper-line shadow-card p-1.5 overflow-hidden shrink-0">
            <Image
              src="/logo-sumba-barat.png"
              alt="Lambang Kabupaten Sumba Barat"
              width={260}
              height={300}
              className="w-full h-full object-contain"
            />
          </span>
          <span>
            <span className="block font-display text-base text-ink leading-none group-hover:text-ink-light transition-colors">
              SIBARA
            </span>
            <span className="block text-[11px] text-slate-muted leading-none mt-1">
              Bank Regulasi Dana BOSP
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/regulasi/baru"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-ink text-paper-card text-sm font-medium px-3.5 py-2 hover:bg-ink-light transition-colors shadow-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Tambah Regulasi
          </Link>

          <div className="hidden md:flex items-center gap-2.5 pl-4 border-l border-paper-line">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-ink/5 text-ink text-[10px] font-semibold font-mono">
              {initials}
            </span>
            {email && (
              <span className="text-xs text-slate-muted max-w-[160px] truncate">
                {email}
              </span>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-sm text-slate-muted hover:text-status-dicabut transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path
                d="M15 17.25V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1.75M9 12h12m0 0-3.5-3.5M21 12l-3.5 3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
