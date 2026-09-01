"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";

export default function ViewToggle({
  view,
  dark = false,
}: {
  view: "grid" | "list";
  dark?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setView(next: "grid" | "list") {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "grid") params.delete("view");
    else params.set("view", next);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-lg p-1 ${
        dark
          ? "border border-white/10 bg-white/5"
          : "border border-white/70 bg-white/90 backdrop-blur-sm shadow-xs"
      }`}
    >
      <button
        onClick={() => setView("grid")}
        aria-label="Tampilan grid"
        className={`inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
          view === "grid"
            ? dark
              ? "bg-gradient-to-r from-accent to-cyan text-white"
              : "bg-accent text-white"
            : dark
            ? "text-white/40 hover:text-white hover:bg-white/10"
            : "text-ink-faint hover:text-ink hover:bg-surface-subtle"
        }`}
      >
        <LayoutGrid size={15} />
      </button>
      <button
        onClick={() => setView("list")}
        aria-label="Tampilan daftar"
        className={`inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
          view === "list"
            ? dark
              ? "bg-gradient-to-r from-accent to-cyan text-white"
              : "bg-accent text-white"
            : dark
            ? "text-white/40 hover:text-white hover:bg-white/10"
            : "text-ink-faint hover:text-ink hover:bg-surface-subtle"
        }`}
      >
        <List size={15} />
      </button>
    </div>
  );
}
