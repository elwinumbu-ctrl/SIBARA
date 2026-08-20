"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const COLLAPSE_KEY = "sibara-sidebar-collapsed";

export default function AppShell({
  active,
  title,
  subtitle,
  email,
  showAddButton = true,
  children,
}: {
  active: string;
  title?: string;
  subtitle?: string;
  email?: string;
  showAddButton?: boolean;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COLLAPSE_KEY);
    if (stored === "1") setCollapsed(true);
  }, []);

  function toggleCollapse() {
    setCollapsed((v) => {
      const next = !v;
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      <Sidebar
        active={active}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={`flex flex-col min-h-screen transition-[margin] duration-200 ease-smooth ${
          collapsed ? "lg:ml-[76px]" : "lg:ml-[264px]"
        }`}
      >
        <Topbar
          active={active}
          title={title}
          subtitle={subtitle}
          email={email}
          showAddButton={showAddButton}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main className="flex-1 px-4 sm:px-6 py-6 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
