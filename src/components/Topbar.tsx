"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { navLabel } from "@/lib/nav";
import {
  Menu,
  Bell,
  ChevronDown,
  LogOut,
  Plus,
  Settings,
  UserRound,
} from "lucide-react";

export default function Topbar({
  active,
  title,
  subtitle,
  email,
  onOpenMobile,
  showAddButton = true,
}: {
  active: string;
  title?: string;
  subtitle?: string;
  email?: string;
  onOpenMobile: () => void;
  showAddButton?: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = email?.split("@")[0]?.slice(0, 2).toUpperCase() ?? "AD";
  const displayTitle = title ?? navLabel(active);

  return (
    <header className="sticky top-0 z-20 h-16 shrink-0 flex items-center gap-3 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75 border-b border-border px-4 sm:px-6">
      <button
        onClick={onOpenMobile}
        className="lg:hidden -ml-1 p-2 rounded-lg text-ink-muted hover:bg-surface-subtle"
        aria-label="Buka menu"
      >
        <Menu size={20} />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="font-display font-bold text-[15px] sm:text-base text-ink leading-none truncate">
          {displayTitle}
        </h1>
        {subtitle && (
          <p className="text-xs text-ink-subtle mt-1 truncate hidden sm:block">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {showAddButton && (
          <Link
            href="/regulasi/baru"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 shadow-xs transition-colors"
          >
            <Plus size={16} strokeWidth={2.4} />
            Tambah Regulasi
          </Link>
        )}
        {showAddButton && (
          <Link
            href="/regulasi/baru"
            aria-label="Tambah Regulasi"
            className="sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-white shadow-xs"
          >
            <Plus size={18} strokeWidth={2.4} />
          </Link>
        )}

        <div className="w-px h-6 bg-border mx-0.5 hidden sm:block" />

        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen((v) => !v);
              setMenuOpen(false);
            }}
            className="relative p-2 rounded-lg text-ink-muted hover:bg-surface-subtle transition-colors"
            aria-label="Notifikasi"
          >
            <Bell size={19} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-status-dicabut" />
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white border border-border shadow-panel p-3 z-20">
                <p className="text-xs font-semibold text-ink px-1 mb-2">Notifikasi</p>
                <div className="rounded-lg bg-status-ditinjau-bg px-3 py-2.5">
                  <p className="text-xs text-ink font-medium mb-0.5">
                    Regulasi perlu ditinjau
                  </p>
                  <p className="text-[11px] text-ink-subtle leading-relaxed">
                    Beberapa regulasi berstatus &quot;Ditinjau&quot; — periksa
                    kembali validitasnya secara berkala.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setMenuOpen((v) => !v);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 rounded-lg pl-1 pr-1.5 sm:pr-2.5 py-1 hover:bg-surface-subtle transition-colors"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
              {initials}
            </span>
            <span className="hidden md:block text-left leading-tight">
              <span className="block text-xs font-semibold text-ink">Administrator</span>
              <span className="block text-[11px] text-ink-faint truncate max-w-[140px]">
                {email ?? "auditor"}
              </span>
            </span>
            <ChevronDown size={15} className="hidden sm:block text-ink-faint" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white border border-border shadow-panel p-1.5 z-20">
                <div className="px-2.5 py-2 mb-1 border-b border-border">
                  <p className="text-xs font-semibold text-ink truncate">
                    {email ?? "Administrator"}
                  </p>
                  <p className="text-[11px] text-ink-faint">Auditor Inspektorat</p>
                </div>
                <Link
                  href="/pengaturan"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-ink-muted hover:bg-surface-subtle hover:text-ink transition-colors"
                >
                  <Settings size={15} />
                  Pengaturan
                </Link>
                <Link
                  href="/pengguna"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-ink-muted hover:bg-surface-subtle hover:text-ink transition-colors"
                >
                  <UserRound size={15} />
                  Profil Pengguna
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-status-dicabut hover:bg-status-dicabut-bg transition-colors"
                >
                  <LogOut size={15} />
                  Keluar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
