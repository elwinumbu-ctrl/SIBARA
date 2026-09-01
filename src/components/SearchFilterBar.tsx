"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import { JENIS_REGULASI, KATEGORI_REGULASI } from "@/lib/types";

export default function SearchFilterBar({ tahunList }: { tahunList: number[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [jenis, setJenis] = useState(searchParams.get("jenis") ?? "");
  const [kategori, setKategori] = useState(searchParams.get("kategori") ?? "");
  const [tahun, setTahun] = useState(searchParams.get("tahun") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "");

  function applyFilter(e?: React.FormEvent) {
    e?.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const view = params.get("view");
    params.forEach((_, key) => params.delete(key));
    if (q) params.set("q", q);
    if (jenis) params.set("jenis", jenis);
    if (kategori) params.set("kategori", kategori);
    if (tahun) params.set("tahun", tahun);
    if (status) params.set("status", status);
    if (view) params.set("view", view);
    router.push(`${pathname}?${params.toString()}`);
  }

  function resetFilter() {
    setQ("");
    setJenis("");
    setKategori("");
    setTahun("");
    setStatus("");
    const view = searchParams.get("view");
    router.push(`${pathname}${view ? `?view=${view}` : ""}`);
  }

  const selectClass =
    "w-full rounded-lg border border-border bg-surface-muted pl-3 pr-8 py-2.5 text-sm text-ink appearance-none focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/10 transition-shadow";

  return (
    <form
      onSubmit={applyFilter}
      className="glass-panel shadow-panel rounded-2xl p-4 sm:p-5 mb-6"
    >
      <div className="relative mb-3">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
        />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari judul atau nomor regulasi..."
          className="w-full rounded-lg border border-border bg-surface-muted pl-10 pr-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/10 transition-shadow"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <select value={jenis} onChange={(e) => setJenis(e.target.value)} className={selectClass}>
          <option value="">Semua jenis</option>
          {JENIS_REGULASI.map((j) => (
            <option key={j} value={j}>{j}</option>
          ))}
        </select>

        <select value={kategori} onChange={(e) => setKategori(e.target.value)} className={selectClass}>
          <option value="">Semua kategori</option>
          {KATEGORI_REGULASI.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>

        <select value={tahun} onChange={(e) => setTahun(e.target.value)} className={selectClass}>
          <option value="">Semua tahun</option>
          {tahunList.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
          <option value="">Semua status</option>
          <option value="berlaku">Berlaku</option>
          <option value="ditinjau">Ditinjau</option>
          <option value="dicabut">Dicabut</option>
        </select>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent hover:bg-accent-600 text-white text-sm font-semibold px-4 py-2.5 transition-colors"
        >
          <SlidersHorizontal size={15} />
          Filter
        </button>
        <button
          type="button"
          onClick={resetFilter}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border text-ink-muted hover:bg-surface-subtle text-sm font-medium px-4 py-2.5 transition-colors"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>
    </form>
  );
}
