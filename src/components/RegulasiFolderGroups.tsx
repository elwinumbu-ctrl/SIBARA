"use client";

import { useState } from "react";
import { ChevronDown, Folder } from "lucide-react";
import { Regulasi, JENIS_REGULASI } from "@/lib/types";
import RegulasiCard from "./RegulasiCard";

export default function RegulasiFolderGroups({
  list,
  view,
  activeJenis,
}: {
  list: Regulasi[];
  view: "grid" | "list";
  /** When a single jenis filter is active, that folder starts open and the rest collapsed. */
  activeJenis?: string;
}) {
  // Group regulasi by jenis, preserving the canonical JENIS_REGULASI order.
  // Any jenis value not in the known list (legacy/free-text data) is bucketed
  // at the end under its own label so nothing gets silently dropped.
  const knownOrder = JENIS_REGULASI;
  const grouped = new Map<string, Regulasi[]>();

  for (const item of list) {
    const key = item.jenis && item.jenis.trim() ? item.jenis : "Lainnya";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(item);
  }

  const orderedKeys = [
    ...knownOrder.filter((j) => grouped.has(j)),
    ...Array.from(grouped.keys()).filter((k) => !knownOrder.includes(k)),
  ];

  if (orderedKeys.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {orderedKeys.map((jenis) => (
        <FolderSection
          key={jenis}
          jenis={jenis}
          items={grouped.get(jenis)!}
          view={view}
          defaultOpen={activeJenis ? jenis === activeJenis : true}
        />
      ))}
    </div>
  );
}

function FolderSection({
  jenis,
  items,
  view,
  defaultOpen,
}: {
  jenis: string;
  items: Regulasi[];
  view: "grid" | "list";
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-white/70 rounded-2xl shadow-panel overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 sm:px-5 py-3.5 hover:bg-surface-subtle transition-colors"
      >
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-accent/8 text-accent shrink-0">
          <Folder size={16} strokeWidth={1.9} />
        </span>
        <span className="font-display font-semibold text-sm text-ink flex-1 text-left truncate">
          {jenis}
        </span>
        <span className="text-xs font-medium text-accent bg-accent/8 rounded-md px-2 py-0.5 shrink-0">
          {items.length}
        </span>
        <ChevronDown
          size={16}
          className={`text-ink-faint shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-border">
          {view === "grid" ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {items.map((r) => (
                <RegulasiCard key={r.id} regulasi={r} view="grid" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-4">
              {items.map((r) => (
                <RegulasiCard key={r.id} regulasi={r} view="list" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
