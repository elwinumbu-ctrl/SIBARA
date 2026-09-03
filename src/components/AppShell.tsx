"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { createClient } from "@/lib/supabase/client";

const COLLAPSE_KEY = "sibara-sidebar-collapsed";

export default function AppShell({
  active,
  title,
  subtitle,
  email,
  showAddButton = true,
  addHref,
  addLabel,
  dark = false,
  isGuest: isGuestProp,
  children,
}: {
  active: string;
  title?: string;
  subtitle?: string;
  email?: string;
  showAddButton?: boolean;
  /** Tujuan & label tombol "Tambah" di topbar. Default: Tambah Regulasi. */
  addHref?: string;
  addLabel?: string;
  /** Cinematic deep-navy background + glass topbar, used across all menu pages. */
  dark?: boolean;
  /** Jika halaman induk (server component) sudah tahu status pengunjung,
   * teruskan di sini untuk menghindari kedipan UI. Jika tidak diberikan,
   * AppShell akan mendeteksi sendiri sesi saat ini (client-side). */
  isGuest?: boolean;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [detectedGuest, setDetectedGuest] = useState(false);
  const isGuest = isGuestProp ?? detectedGuest;

  useEffect(() => {
    const stored = localStorage.getItem(COLLAPSE_KEY);
    if (stored === "1") setCollapsed(true);
  }, []);

  useEffect(() => {
    if (isGuestProp !== undefined) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setDetectedGuest(Boolean(data.user?.is_anonymous));
    });
  }, [isGuestProp]);

  function toggleCollapse() {
    setCollapsed((v) => {
      const next = !v;
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  }

  return (
    <div className={`relative min-h-screen overflow-hidden ${dark ? "bg-[#071229]" : ""}`}>
      {dark ? (
        <>
          {/* Deep navy → royal blue cinematic canvas, reserved for the dashboard */}
          <div
            className="pointer-events-none fixed inset-0 z-0"
            style={{
              background:
                "radial-gradient(120% 90% at 12% -10%, #123a72 0%, #0a2348 38%, #06152f 72%, #050f24 100%)",
            }}
          />
          <div className="pointer-events-none fixed inset-0 z-0 pattern-dots opacity-[0.05]" />
          <div
            className="pointer-events-none fixed inset-0 z-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          <div className="pointer-events-none fixed -top-32 right-[-8%] z-0 w-[560px] h-[560px] rounded-full bg-accent/20 blur-[120px]" />
          <div className="pointer-events-none fixed bottom-[-18%] left-[-10%] z-0 w-[480px] h-[480px] rounded-full bg-cyan/15 blur-[120px]" />
          <div className="pointer-events-none fixed inset-0 z-0 shadow-[inset_0_0_180px_60px_rgba(2,8,20,0.55)]" />
        </>
      ) : (
        <>
          {/* Ambient background layer — soft blue-gray depth behind every workspace page */}
          <div className="pointer-events-none fixed inset-0 z-0 pattern-dots-soft opacity-[0.5]" />
          <div className="pointer-events-none fixed -top-40 right-[-10%] z-0 w-[520px] h-[520px] rounded-full bg-accent/10 blur-3xl" />
          <div className="pointer-events-none fixed bottom-[-15%] left-[-8%] z-0 w-[440px] h-[440px] rounded-full bg-cyan/8 blur-3xl" />
        </>
      )}

      <Sidebar
        active={active}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        isGuest={isGuest}
      />

      <div
        className={`relative z-10 flex flex-col min-h-screen transition-[margin] duration-200 ease-smooth ${
          collapsed ? "lg:ml-[76px]" : "lg:ml-[264px]"
        }`}
      >
        <Topbar
          active={active}
          title={title}
          subtitle={subtitle}
          email={email}
          showAddButton={showAddButton}
          {...(addHref ? { addHref } : {})}
          {...(addLabel ? { addLabel } : {})}
          onOpenMobile={() => setMobileOpen(true)}
          dark={dark}
          isGuest={isGuest}
        />
        <main className="flex-1 px-4 sm:px-6 py-6 max-w-[1400px] w-full mx-auto animate-[fadein_0.4s_ease]">
          {children}
        </main>
      </div>
    </div>
  );
}
