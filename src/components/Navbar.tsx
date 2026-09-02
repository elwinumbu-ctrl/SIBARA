"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTheme, type ThemeChoice } from "@/components/ThemeProvider";

const THEME_OPTIONS: {
  value: ThemeChoice;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "light",
    label: "Terang",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="4.2" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.55 1.55M17.85 17.85l1.55 1.55M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.55-1.55M17.85 6.15l1.55-1.55"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Gelap",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path
          d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    value: "system",
    label: "Ikuti Sistem",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4.5" width="18" height="12" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.5 20.5h7M12 16.5v4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

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
            <span className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-white ring-1 ring-paper-line shadow-card p-1.5 overflow-hidden shrink-0">
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

            <div className="relative">
              <button
                onClick={() => setSettingsOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-3 text-sm text-paper-card/70 hover:text-paper-card transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                  <path
                    d="M19.4 13.5a1.7 1.7 0 0 0 .35 1.87l.06.06a2.06 2.06 0 1 1-2.92 2.92l-.06-.06a1.7 1.7 0 0 0-1.87-.35 1.7 1.7 0 0 0-1.03 1.56V19.6a2.06 2.06 0 1 1-4.12 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.35l-.06.06a2.06 2.06 0 1 1-2.92-2.92l.06-.06a1.7 1.7 0 0 0 .35-1.87 1.7 1.7 0 0 0-1.56-1.03H4.4a2.06 2.06 0 1 1 0-4.12h.09A1.7 1.7 0 0 0 6.05 8.8a1.7 1.7 0 0 0-.35-1.87l-.06-.06A2.06 2.06 0 1 1 8.56 3.95l.06.06a1.7 1.7 0 0 0 1.87.35H10.6a1.7 1.7 0 0 0 1.03-1.56V2.66a2.06 2.06 0 1 1 4.12 0v.09a1.7 1.7 0 0 0 1.03 1.56h.11a1.7 1.7 0 0 0 1.87-.35l.06-.06a2.06 2.06 0 1 1 2.92 2.92l-.06.06a1.7 1.7 0 0 0-.35 1.87V8.8a1.7 1.7 0 0 0 1.56 1.03h.09a2.06 2.06 0 1 1 0 4.12h-.09a1.7 1.7 0 0 0-1.56 1.03Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Pengaturan
              </button>
              {settingsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setSettingsOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-64 rounded-lg bg-paper-card border border-paper-line shadow-2xl p-4 z-20 text-left">
                    <p className="text-xs font-medium text-ink mb-3">Tema</p>
                    <div className="space-y-1">
                      {THEME_OPTIONS.map((opt) => {
                        const active = theme === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => setTheme(opt.value)}
                            className={`w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                              active
                                ? "bg-ink/5 text-ink font-medium"
                                : "text-slate-muted hover:bg-ink/5 hover:text-ink"
                            }`}
                          >
                            <span className={active ? "text-seal" : "text-slate-muted"}>
                              {opt.icon}
                            </span>
                            <span className="flex-1 text-left">{opt.label}</span>
                            {active && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <path d="m5 12.5 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
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
