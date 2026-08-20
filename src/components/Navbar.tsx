"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const MENU_ITEMS = [
  { label: "Beranda", href: "/dashboard" },
  { label: "Berlaku", href: "/dashboard?status=berlaku" },
  { label: "Ditinjau", href: "/dashboard?status=ditinjau" },
  { label: "Dicabut", href: "/dashboard?status=dicabut" },
  { label: "Tambah Regulasi", href: "/regulasi/baru" },
];

export default function Navbar({ email }: { email?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [helpOpen, setHelpOpen] = useState(false);

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

  function isActive(href: string) {
    const [hrefPath, hrefQuery] = href.split("?");
    if (hrefPath !== pathname) return false;
    if (!hrefQuery) return !searchParams.get("status");
    const hrefStatus = new URLSearchParams(hrefQuery).get("status");
    return searchParams.get("status") === hrefStatus;
  }

  return (
    <header className="sticky top-0 z-20">
      {/* Identity row */}
      <div className="border-b border-paper-line bg-paper-card/90 backdrop-blur supports-[backdrop-filter]:bg-paper-card/75">
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
      </div>

      {/* Menu strip */}
      <div className="relative bg-ink-dark border-b border-black/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center justify-center gap-1 overflow-x-auto no-scrollbar">
            {MENU_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative whitespace-nowrap px-4 py-3 text-sm transition-colors ${
                    active
                      ? "text-seal-light font-medium"
                      : "text-paper-card/70 hover:text-paper-card"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute left-4 right-4 -bottom-px h-0.5 bg-seal-light rounded-full" />
                  )}
                </Link>
              );
            })}

            <div className="relative">
              <button
                onClick={() => setHelpOpen((v) => !v)}
                className="whitespace-nowrap px-4 py-3 text-sm text-paper-card/70 hover:text-paper-card transition-colors"
              >
                Bantuan
              </button>
              {helpOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setHelpOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-64 rounded-lg bg-paper-card border border-paper-line shadow-2xl p-4 z-20 text-left">
                    <p className="text-xs font-medium text-ink mb-1">
                      Butuh bantuan?
                    </p>
                    <p className="text-xs text-slate-muted leading-relaxed">
                      Akses terbatas untuk auditor Inspektorat Kabupaten
                      Sumba Barat. Hubungi admin sistem untuk pembuatan akun
                      atau kendala teknis.
                    </p>
                  </div>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
