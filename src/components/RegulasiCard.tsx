import Link from "next/link";
import { Regulasi } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import { ArrowUpRight, Building2, FileText, Paperclip } from "lucide-react";

const TAB_COLOR: Record<string, string> = {
  berlaku: "#16A34A",
  ditinjau: "#D97706",
  dicabut: "#DC2626",
};

export default function RegulasiCard({
  regulasi,
  view = "grid",
}: {
  regulasi: Regulasi;
  view?: "grid" | "list";
}) {
  if (view === "list") {
    return (
      <Link
        href={`/regulasi/${regulasi.id}`}
        className="status-tab group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 bg-white border border-border rounded-2xl shadow-card hover:shadow-card-hover hover:border-accent/30 hover-lift p-4 sm:pl-6"
        style={{ "--tab-color": TAB_COLOR[regulasi.status] } as React.CSSProperties}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/8 text-primary shrink-0 mt-0.5">
            <FileText size={17} strokeWidth={1.9} />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[11px] text-ink-faint">
                {regulasi.nomor_regulasi || "Tanpa nomor"} · {regulasi.tahun}
              </span>
            </div>
            <h3 className="font-display font-semibold text-[15px] text-ink leading-snug truncate group-hover:text-accent transition-colors">
              {regulasi.judul}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-faint mt-1">
              <span>{regulasi.jenis}</span>
              <span className="w-1 h-1 rounded-full bg-border-strong" />
              <span className="flex items-center gap-1">
                <Building2 size={11} /> {regulasi.instansi_penerbit}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
          <span className="text-xs font-medium text-accent bg-accent/8 rounded-md px-2 py-1 hidden md:inline-block">
            {regulasi.kategori}
          </span>
          {regulasi.file_path && (
            <span className="text-ink-faint" title="Punya dokumen">
              <Paperclip size={14} />
            </span>
          )}
          <StatusBadge status={regulasi.status} size="sm" />
          <ArrowUpRight size={16} className="text-ink-faint group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/regulasi/${regulasi.id}`}
      className="status-tab group block bg-white border border-border rounded-2xl shadow-card hover:shadow-card-hover hover:border-accent/30 hover-lift p-5"
      style={{ "--tab-color": TAB_COLOR[regulasi.status] } as React.CSSProperties}
    >
      <div className="flex items-start justify-between gap-3 mb-3 pl-2.5">
        <span className="font-mono text-[11px] text-ink-faint">
          {regulasi.nomor_regulasi || "Tanpa nomor"} · {regulasi.tahun}
        </span>
        <StatusBadge status={regulasi.status} size="sm" />
      </div>

      <h3 className="font-display font-semibold text-[15px] text-ink leading-snug mb-2 line-clamp-2 pl-2.5 group-hover:text-accent transition-colors">
        {regulasi.judul}
      </h3>

      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-faint pl-2.5">
        <span>{regulasi.jenis}</span>
        <span className="text-border-strong">•</span>
        <span className="flex items-center gap-1 truncate">
          <Building2 size={11} className="shrink-0" /> {regulasi.instansi_penerbit}
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between pl-2.5">
        <span className="text-xs font-medium text-accent bg-accent/8 rounded-md px-2 py-0.5 truncate max-w-[65%]">
          {regulasi.kategori}
        </span>
        <span className="flex items-center gap-2 shrink-0">
          {regulasi.file_path && (
            <span className="inline-flex items-center gap-1 text-xs text-ink-faint">
              <Paperclip size={12} /> Dokumen
            </span>
          )}
          <ArrowUpRight size={15} className="text-ink-faint group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </span>
      </div>
    </Link>
  );
}
