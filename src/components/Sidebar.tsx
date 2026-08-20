"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronsLeft, ChevronsRight, X, ShieldCheck } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";

export default function Sidebar({
  active,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: {
  active: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
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
        className={`fixed z-40 inset-y-0 left-0 flex flex-col bg-primary text-white transition-all duration-200 ease-smooth
          ${collapsed ? "lg:w-[76px]" : "lg:w-[264px]"}
          ${mobileOpen ? "w-[264px] translate-x-0" : "w-[264px] -translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Brand */}
        <div className={`flex items-center h-16 shrink-0 ${collapsed ? "justify-center px-2" : "justify-between px-4"}`}>
          <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white p-1.5 shrink-0 overflow-hidden">
              <Image
                src="/logo-sumba-barat.png"
                alt="Lambang Kabupaten Sumba Barat"
                width={260}
                height={300}
                className="w-full h-full object-contain"
              />
            </span>
            {!collapsed && (
              <span className="min-w-0">
                <span className="block font-display font-bold text-sm leading-none tracking-wide">
                  SIBARA
                </span>
                <span className="block text-[10.5px] text-white/55 leading-none mt-1 truncate">
                  Bank Regulasi Dana BOSP
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

        <div className="h-px bg-white/10 mx-4 mb-2" />

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto thin-scrollbar px-3 py-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.key;
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={onCloseMobile}
                title={collapsed ? item.label : undefined}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] transition-colors
                  ${collapsed ? "lg:justify-center lg:px-0" : ""}
                  ${
                    isActive
                      ? "bg-white/12 text-white font-medium"
                      : "text-white/65 hover:text-white hover:bg-white/8"
                  }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-accent-light" />
                )}
                <Icon size={18} strokeWidth={1.9} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="h-px bg-white/10 mx-4" />

        {/* Footer: collapse toggle + identity */}
        <div className="p-3 shrink-0">
          {!collapsed && (
            <div className="hidden lg:flex items-center gap-2 rounded-lg px-3 py-2.5 mb-1 text-white/45 text-[11px]">
              <ShieldCheck size={14} />
              <span>Inspektorat Wilayah IV</span>
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
