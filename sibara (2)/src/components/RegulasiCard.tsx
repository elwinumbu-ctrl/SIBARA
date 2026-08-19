import Link from "next/link";
import { Regulasi } from "@/lib/types";
import StatusBadge from "./StatusBadge";

const TAB_COLOR: Record<string, string> = {
  berlaku: "#3F7355",
  ditinjau: "#B8862E",
  dicabut: "#A64B4B",
};

export default function RegulasiCard({ regulasi }: { regulasi: Regulasi }) {
  return (
    <Link
      href={`/regulasi/${regulasi.id}`}
      className="arsip-tab block bg-paper-card border border-paper-line rounded-lg shadow-card hover:shadow-md hover:-translate-y-0.5 transition-all p-5"
      style={
        {
          "--tab-color": TAB_COLOR[regulasi.status],
        } as React.CSSProperties
      }
    >
      <style>{`.arsip-tab::before { background-color: var(--tab-color); }`}</style>

      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="font-mono text-[11px] text-slate-muted">
          {regulasi.nomor_regulasi || "Tanpa nomor"} · {regulasi.tahun}
        </span>
        <StatusBadge status={regulasi.status} />
      </div>

      <h3 className="font-display text-base text-ink leading-snug mb-2 line-clamp-2">
        {regulasi.judul}
      </h3>

      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-muted">
        <span>{regulasi.jenis}</span>
        <span className="text-paper-line">•</span>
        <span>{regulasi.instansi_penerbit}</span>
      </div>

      <div className="mt-3 pt-3 border-t border-paper-line flex items-center justify-between">
        <span className="text-xs font-medium text-ink-light bg-ink/5 rounded px-2 py-0.5">
          {regulasi.kategori}
        </span>
        {regulasi.file_path && (
          <span className="text-xs text-slate-muted">📎 Dokumen</span>
        )}
      </div>
    </Link>
  );
}
