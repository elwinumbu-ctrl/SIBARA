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
  addHref = "/regulasi/baru",
  addLabel = "Tambah Regulasi",
  dark = false,
}: {
  active: string;
  title?: string;
  subtitle?: string;
  email?: string;
  onOpenMobile: () => void;
  showAddButton?: boolean;
  addHref?: string;
  addLabel?: string;
  dark?: boolean;
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
    <header
      className={`sticky top-0 z-20 h-16 shrink-0 flex items-center gap-3 px-4 sm:px-6 ${
        dark
          ? "bg-[#081937]/80 backdrop-blur-xl border-b border-white/[0.08]"
          : "bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/75 border-b border-white/60 shadow-[0_1px_0_rgba(16,24,40,0.03)]"
      }`}
    >
      <button
        onClick={onOpenMobile}
        className={`lg:hidden -ml-1 p-2 rounded-lg ${
          dark ? "text-white/70 hover:bg-white/10" : "text-ink-muted hover:bg-surface-subtle"
        }`}
        aria-label="Buka menu"
      >
        <Menu size={20} />
      </button>

      <div className="min-w-0 flex-1">
        <h1
          className={`font-display font-bold text-[15px] sm:text-base leading-none truncate ${
            dark ? "text-white" : "text-ink"
          }`}
        >
          {displayTitle}
        </h1>
        {subtitle && (
          <p
            className={`text-xs mt-1 truncate hidden sm:block ${
              dark ? "text-white/50" : "text-ink-subtle"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {showAddButton && (
          <Link
            href={addHref}
            className={`hidden sm:inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold px-4 py-2.5 transition-colors ${
              dark
                ? "bg-gradient-to-r from-accent to-cyan text-white shadow-glow hover:brightness-110"
                : "bg-accent hover:bg-accent-600 text-white shadow-xs"
            }`}
          >
            <Plus size={16} strokeWidth={2.4} />
            {addLabel}
          </Link>
        )}
        {showAddButton && (
          <Link
            href={addHref}
            aria-label={addLabel}
            className={`sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-white ${
              dark ? "bg-gradient-to-r from-accent to-cyan shadow-glow" : "bg-accent shadow-xs"
            }`}
          >
            <Plus size={18} strokeWidth={2.4} />
          </Link>
        )}

        <div className={`w-px h-6 mx-0.5 hidden sm:block ${dark ? "bg-white/10" : "bg-border"}`} />

        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen((v) => !v);
              setMenuOpen(false);
            }}
            className={`relative p-2 rounded-lg transition-colors ${
              dark ? "text-white/70 hover:bg-white/10" : "text-ink-muted hover:bg-surface-subtle"
            }`}
            aria-label="Notifikasi"
          >
            <Bell size={19} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-status-dicabut" />
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <div
                className={`absolute right-0 top-full mt-2 w-72 rounded-xl p-3 z-20 ${
                  dark
                    ? "bg-[#0c2447]/95 backdrop-blur-xl border border-white/10 shadow-2xl"
                    : "bg-white/95 backdrop-blur-xl border border-white/70 shadow-panel"
                }`}
              >
                <p className={`text-xs font-semibold px-1 mb-2 ${dark ? "text-white" : "text-ink"}`}>
                  Notifikasi
                </p>
                <div
                  className={`rounded-lg px-3 py-2.5 ${
                    dark ? "bg-status-ditinjau/10 border border-status-ditinjau/20" : "bg-status-ditinjau-bg"
                  }`}
                >
                  <p className={`text-xs font-medium mb-0.5 ${dark ? "text-white" : "text-ink"}`}>
                    Regulasi perlu ditinjau
                  </p>
                  <p className={`text-[11px] leading-relaxed ${dark ? "text-white/60" : "text-ink-subtle"}`}>
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
            className={`flex items-center gap-2 rounded-lg pl-1 pr-1.5 sm:pr-2.5 py-1 transition-colors ${
              dark ? "hover:bg-white/10" : "hover:bg-surface-subtle"
            }`}
          >
            <span
              className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-[11px] font-bold ${
                dark ? "bg-white/10 text-white" : "bg-primary/10 text-primary"
              }`}
            >
              {initials}
            </span>
            <span className="hidden md:block text-left leading-tight">
              <span className={`block text-xs font-semibold ${dark ? "text-white" : "text-ink"}`}>
                Administrator
              </span>
              <span
                className={`block text-[11px] truncate max-w-[140px] ${
                  dark ? "text-white/50" : "text-ink-faint"
                }`}
              >
                {email ?? "auditor"}
              </span>
            </span>
            <ChevronDown size={15} className={dark ? "hidden sm:block text-white/50" : "hidden sm:block text-ink-faint"} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div
                className={`absolute right-0 top-full mt-2 w-56 rounded-xl p-1.5 z-20 ${
                  dark
                    ? "bg-[#0c2447]/95 backdrop-blur-xl border border-white/10 shadow-2xl"
                    : "bg-white/95 backdrop-blur-xl border border-white/70 shadow-panel"
                }`}
              >
                <div className={`px-2.5 py-2 mb-1 border-b ${dark ? "border-white/10" : "border-border"}`}>
                  <p className={`text-xs font-semibold truncate ${dark ? "text-white" : "text-ink"}`}>
                    {email ?? "Administrator"}
                  </p>
                  <p className={`text-[11px] ${dark ? "text-white/50" : "text-ink-faint"}`}>
                    Auditor Inspektorat
                  </p>
                </div>
                <Link
                  href="/pengaturan"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                    dark ? "text-white/70 hover:bg-white/10 hover:text-white" : "text-ink-muted hover:bg-surface-subtle hover:text-ink"
                  }`}
                >
                  <Settings size={15} />
                  Pengaturan
                </Link>
                <Link
                  href="/pengguna"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                    dark ? "text-white/70 hover:bg-white/10 hover:text-white" : "text-ink-muted hover:bg-surface-subtle hover:text-ink"
                  }`}
                >
                  <UserRound size={15} />
                  Profil Pengguna
                </Link>
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                    dark ? "text-status-dicabut hover:bg-status-dicabut/10" : "text-status-dicabut hover:bg-status-dicabut-bg"
                  }`}
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
