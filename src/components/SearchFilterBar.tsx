"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { JENIS_REGULASI, KATEGORI_REGULASI } from "@/lib/types";

export default function SearchFilterBar({ tahunList }: { tahunList: number[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="bg-paper-card border border-paper-line rounded-lg shadow-card p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-3">
        <input
          type="text"
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => updateParam("q", e.target.value)}
          placeholder="Cari judul atau nomor regulasi..."
          className="flex-1 rounded-md border border-paper-line bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <select
            defaultValue={searchParams.get("jenis") ?? ""}
            onChange={(e) => updateParam("jenis", e.target.value)}
            className="rounded-md border border-paper-line bg-white px-2.5 py-2 text-sm focus:border-ink focus:outline-none"
          >
            <option value="">Semua jenis</option>
            {JENIS_REGULASI.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>

          <select
            defaultValue={searchParams.get("kategori") ?? ""}
            onChange={(e) => updateParam("kategori", e.target.value)}
            className="rounded-md border border-paper-line bg-white px-2.5 py-2 text-sm focus:border-ink focus:outline-none"
          >
            <option value="">Semua kategori</option>
            {KATEGORI_REGULASI.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>

          <select
            defaultValue={searchParams.get("tahun") ?? ""}
            onChange={(e) => updateParam("tahun", e.target.value)}
            className="rounded-md border border-paper-line bg-white px-2.5 py-2 text-sm focus:border-ink focus:outline-none"
          >
            <option value="">Semua tahun</option>
            {tahunList.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            defaultValue={searchParams.get("status") ?? ""}
            onChange={(e) => updateParam("status", e.target.value)}
            className="rounded-md border border-paper-line bg-white px-2.5 py-2 text-sm focus:border-ink focus:outline-none"
          >
            <option value="">Semua status</option>
            <option value="berlaku">Berlaku</option>
            <option value="ditinjau">Ditinjau</option>
            <option value="dicabut">Dicabut</option>
          </select>
        </div>
      </div>
    </div>
  );
}
