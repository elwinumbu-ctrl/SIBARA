"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronsLeft, ChevronsRight, ChevronDown, X, ShieldCheck, Eye } from "lucide-react";
import { NAV_ITEMS, type NavItem } from "@/lib/nav";

export default function Sidebar({
  active,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  isGuest = false,
  isAdmin = false,
}: {
  active: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  isGuest?: boolean;
  /** true kalau pengguna yang login punya role admin (menampilkan menu adminOnly, mis. Manajemen Pengguna). */
  isAdmin?: boolean;
}) {
  const items = NAV_ITEMS.filter(
    (item) =>
      !item.hideFromSidebar &&
      (!isGuest || item.guestAllowed !== false) &&
      (!item.adminOnly || isAdmin)
  );

  const isDashboardActive = active === "dashboard";

  // Hanya satu grup yang boleh terbuka dalam satu waktu: state accordion
  // disimpan sebagai satu key saja (bukan per-item), jadi saat grup lain
  // dibuka, grup yang sedang terbuka otomatis tertutup.
  const [openGroup, setOpenGroup] = useState<string | null>(() => {
    const activeGroup = items.find((item) => item.children?.some((c) => c.key === active));
    return activeGroup?.key ?? null;
  });

  function toggleGroup(key: string) {
    setOpenGroup((prev) => (prev === key ? null : key));
  }

  function renderLink(item: NavItem, isChild: boolean) {
    const isActive = active === item.key;
    const Icon = item.icon;
    return (
      <Link
        key={item.key}
        href={item.href}
        onClick={onCloseMobile}
        title={collapsed ? item.label : undefined}
        className={`group relative flex items-center gap-3 rounded-xl text-[13.5px] transition-all duration-150
          ${isChild ? "py-2 pl-[2.6rem] pr-3" : "px-3 py-2.5"}
          ${collapsed ? "lg:justify-center lg:px-0 lg:pl-0" : ""}
          ${
            isActive
              ? "bg-accent/90 text-white font-semibold shadow-glow"
              : "text-white/65 hover:text-white hover:bg-white/8"
          }`}
      >
        {isActive && !collapsed && (
          <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-cyan" />
        )}
        <Icon size={isChild ? 16 : 18} strokeWidth={1.9} className="shrink-0" />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </Link>
    );
  }

  return (
    <>
      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed z-40 inset-y-0 left-0 flex flex-col text-white transition-all duration-200 ease-smooth overflow-hidden
          bg-gradient-to-b from-primary-800 via-primary to-primary-900
          ${collapsed ? "lg:w-[76px]" : "lg:w-[264px]"}
          ${mobileOpen ? "w-[264px] translate-x-0" : "w-[264px] -translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Ambient background pattern + glow */}
        <div className="pointer-events-none absolute inset-0 pattern-dots opacity-[0.04]" />
        <div className="pointer-events-none absolute -top-24 -left-16 w-56 h-56 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -right-16 w-56 h-56 rounded-full bg-cyan/10 blur-3xl" />

        {/* Brand */}
        <div className={`relative flex items-center h-16 shrink-0 ${collapsed ? "justify-center px-2" : "justify-between px-4"}`}>
          <Link
            href="/dashboard"
            onClick={onCloseMobile}
            title="SIBARA — Beranda"
            aria-label="Buka Beranda"
            className="flex items-center gap-2.5 min-w-0 group"
          >
            <span
              className={`relative inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white p-0.5 shrink-0 overflow-hidden ring-2 transition-all duration-150
                ${
                  isDashboardActive
                    ? "ring-cyan shadow-glow"
                    : "ring-transparent group-hover:ring-cyan/60"
                }`}
            >
              <Image
                src="/logo-sumba-barat.png"
                alt="Lambang Kabupaten Sumba Barat — buka Beranda"
                width={260}
                height={300}
                className="w-full h-full object-cover"
              />
            </span>
            {!collapsed && (
              <span className="min-w-0">
                <span
                  className={`block font-display font-bold text-sm leading-none tracking-wide transition-colors ${
                    isDashboardActive ? "text-cyan" : "group-hover:text-cyan"
                  }`}
                >
                  SIBARA
                </span>
                <span className="block text-[10.5px] text-white/55 leading-none mt-1 truncate">
                  Sistem Informasi Bank Regulasi
                </span>
              </span>
            )}
          </Link>
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-white/60 hover:text-white p-1"
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative h-px bg-white/10 mx-4 mb-2" />

        {/* Nav */}
        <nav className="relative flex-1 overflow-y-auto thin-scrollbar px-3 py-2.5 space-y-1">
          {items.map((item) => {
            if (!item.children) {
              return renderLink(item, false);
            }

            // Grup dengan sub-menu (mis. "Regulasi") -> accordion.
            const children = item.children.filter(
              (child) => !isGuest || child.guestAllowed !== false
            );
            const isGroupActive = children.some((child) => child.key === active);
            const isOpen = collapsed ? false : openGroup === item.key;
            const Icon = item.icon;

            // Sidebar diciutkan: tampilkan sebagai ikon tautan biasa ke
            // halaman utama grup (mis. ikon Regulasi -> /regulasi).
            if (collapsed) {
              return renderLink({ ...item }, false);
            }

            return (
              <div key={item.key}>
                <button
                  type="button"
                  onClick={() => toggleGroup(item.key)}
                  aria-expanded={isOpen}
                  className={`group relative flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-[13.5px] transition-all duration-150
                    ${
                      isGroupActive
                        ? "text-white font-semibold"
                        : "text-white/65 hover:text-white hover:bg-white/8"
                    }`}
                >
                  {isGroupActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-cyan" />
                  )}
                  <Icon size={18} strokeWidth={1.9} className="shrink-0" />
                  <span className="truncate flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    size={15}
                    className={`shrink-0 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="mt-1 space-y-0.5">
                    {children.map((child) => renderLink(child, true))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="relative h-px bg-white/10 mx-4" />

        {/* Footer: collapse toggle + identity */}
        <div className="relative p-3 shrink-0">
          {!collapsed && (
            <div className="hidden lg:flex items-center gap-2 rounded-lg px-3 py-2.5 mb-1 text-white/45 text-[11px]">
              {isGuest ? (
                <>
                  <Eye size={14} className="text-cyan" />
                  <span className="text-cyan">Mode Pengunjung (Read-only)</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={14} />
                  <span>Inspektorat Wilayah IV</span>
                </>
              )}
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className={`hidden lg:flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-[13px] text-white/65 hover:text-white hover:bg-white/8 transition-colors ${
              collapsed ? "justify-center px-0" : ""
            }`}
          >
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            {!collapsed && <span>Ciutkan menu</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
