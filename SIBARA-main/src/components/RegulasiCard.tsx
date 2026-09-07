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
  dark = false,
}: {
  regulasi: Regulasi;
  view?: "grid" | "list";
  /** Render on the cinematic navy canvas (glass card, white-on-dark text). */
  dark?: boolean;
}) {
  if (view === "list") {
    return (
      <Link
        href={`/regulasi/${regulasi.id}`}
        className={`status-tab group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 hover-lift p-4 sm:pl-6 ${
          dark
            ? "surface-card-dark hover:border-cyan/30"
            : "surface-card hover:shadow-card-hover hover:border-accent/30"
        }`}
        style={{ "--tab-color": TAB_COLOR[regulasi.status] } as React.CSSProperties}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span
            className={`hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-xl shrink-0 mt-0.5 ${
              dark ? "bg-white/8 text-cyan" : "bg-primary/8 text-primary"
            }`}
          >
            <FileText size={17} strokeWidth={1.9} />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-mono text-[11px] ${dark ? "text-white/40" : "text-ink-faint"}`}>
                {regulasi.nomor_regulasi || "Tanpa nomor"} · {regulasi.tahun}
              </span>
            </div>
            <h3
              className={`font-display font-semibold text-[15px] leading-snug truncate transition-colors ${
                dark ? "text-white group-hover:text-cyan" : "text-ink group-hover:text-accent"
              }`}
            >
              {regulasi.judul}
            </h3>
            <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mt-1 ${dark ? "text-white/40" : "text-ink-faint"}`}>
              <span>{regulasi.jenis}</span>
              <span className={`w-1 h-1 rounded-full ${dark ? "bg-white/20" : "bg-border-strong"}`} />
              <span className="flex items-center gap-1">
                <Building2 size={11} /> {regulasi.instansi_penerbit}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
          <span
            className={`text-xs font-medium rounded-md px-2 py-1 hidden md:inline-block ${
              dark ? "text-cyan bg-cyan/10" : "text-accent bg-accent/8"
            }`}
          >
            {regulasi.kategori}
          </span>
          {regulasi.file_path && (
            <span className={dark ? "text-white/40" : "text-ink-faint"} title="Punya dokumen">
              <Paperclip size={14} />
            </span>
          )}
          <StatusBadge status={regulasi.status} size="sm" dark={dark} />
          <ArrowUpRight
            size={16}
            className={`transition-all ${
              dark
                ? "text-white/30 group-hover:text-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                : "text-ink-faint group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            }`}
          />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/regulasi/${regulasi.id}`}
      className={`status-tab group block hover-lift p-5 ${
        dark
          ? "surface-card-dark hover:border-cyan/30"
          : "surface-card hover:shadow-card-hover hover:border-accent/30"
      }`}
      style={{ "--tab-color": TAB_COLOR[regulasi.status] } as React.CSSProperties}
    >
      <div className="flex items-start justify-between gap-3 mb-3 pl-2.5">
        <span className={`font-mono text-[11px] ${dark ? "text-white/40" : "text-ink-faint"}`}>
          {regulasi.nomor_regulasi || "Tanpa nomor"} · {regulasi.tahun}
        </span>
        <StatusBadge status={regulasi.status} size="sm" dark={dark} />
      </div>

      <h3
        className={`font-display font-semibold text-[15px] leading-snug mb-2 line-clamp-2 pl-2.5 transition-colors ${
          dark ? "text-white group-hover:text-cyan" : "text-ink group-hover:text-accent"
        }`}
      >
        {regulasi.judul}
      </h3>

      <div className={`flex flex-wrap gap-x-3 gap-y-1 text-xs pl-2.5 ${dark ? "text-white/40" : "text-ink-faint"}`}>
        <span>{regulasi.jenis}</span>
        <span className={dark ? "text-white/20" : "text-border-strong"}>•</span>
        <span className="flex items-center gap-1 truncate">
          <Building2 size={11} className="shrink-0" /> {regulasi.instansi_penerbit}
        </span>
      </div>

      <div
        className={`mt-3 pt-3 border-t flex items-center justify-between pl-2.5 ${
          dark ? "border-white/10" : "border-border"
        }`}
      >
        <span
          className={`text-xs font-medium rounded-md px-2 py-0.5 truncate max-w-[65%] ${
            dark ? "text-cyan bg-cyan/10" : "text-accent bg-accent/8"
          }`}
        >
          {regulasi.kategori}
        </span>
        <span className="flex items-center gap-2 shrink-0">
          {regulasi.file_path && (
            <span className={`inline-flex items-center gap-1 text-xs ${dark ? "text-white/40" : "text-ink-faint"}`}>
              <Paperclip size={12} /> Dokumen
            </span>
          )}
          <ArrowUpRight
            size={15}
            className={`transition-all ${
              dark
                ? "text-white/30 group-hover:text-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                : "text-ink-faint group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            }`}
          />
        </span>
      </div>
    </Link>
  );
}
