import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";
import { Regulasi } from "@/lib/types";
import {
  ArrowUpRight,
  Building2,
  FileSearch,
  FileText,
  Paperclip,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

// Palet aksen untuk donut chart "Sebaran per Jenis Regulasi" — hanya warna,
// urutan & jumlah tetap mengikuti data existing (jenisBreakdown).
const DONUT_COLORS = ["#3B82F6", "#0EA5E9", "#22C55E", "#F59E0B", "#A855F7", "#EF4444", "#F472B6"];

const STATUS_DOT: Record<string, string> = {
  berlaku: "#22C55E",
  ditinjau: "#F59E0B",
  dicabut: "#EF4444",
};
const STATUS_LABEL: Record<string, string> = {
  berlaku: "Berlaku",
  ditinjau: "Ditinjau",
  dicabut: "Dicabut",
};
const STATUS_ICON: Record<string, typeof CheckCircle2> = {
  berlaku: CheckCircle2,
  ditinjau: Clock,
  dicabut: XCircle,
};

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: allRegulasi } = await supabase
    .from("regulasi")
    .select("tahun, status, jenis");

  const { data: recent } = await supabase
    .from("regulasi")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const total = allRegulasi?.length ?? 0;
  const berlaku = (allRegulasi ?? []).filter((r) => r.status === "berlaku").length;
  const ditinjau = (allRegulasi ?? []).filter((r) => r.status === "ditinjau").length;
  const dicabut = (allRegulasi ?? []).filter((r) => r.status === "dicabut").length;

  const jenisCounts: Record<string, number> = {};
  (allRegulasi ?? []).forEach((r) => {
    jenisCounts[r.jenis] = (jenisCounts[r.jenis] ?? 0) + 1;
  });
  const jenisBreakdown = Object.entries(jenisCounts).sort((a, b) => b[1] - a[1]);

  const recentList = (recent ?? []) as Regulasi[];

  const displayName = user?.email?.split("@")[0] ?? "Auditor";
  // Selalu hitung berdasarkan jam WITA (zona waktu Waikabubak, Sumba Barat, NTT),
  // bukan zona waktu server — supaya sapaan pagi/siang/sore/malam selalu tepat
  // untuk pengguna di Indonesia, di mana pun server ini di-hosting.
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Makassar",
    }).format(new Date())
  );
  const greeting =
    hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 18 ? "Selamat sore" : "Selamat malam";

  // --- Donut chart geometry (real data, no dummy values) ---
  const R = 54;
  const STROKE = 16;
  const CIRC = 2 * Math.PI * R;
  let cumulative = 0;
  const donutSegments = jenisBreakdown.map(([jenis, count], i) => {
    const fraction = total > 0 ? count / total : 0;
    const dash = fraction * CIRC;
    const seg = {
      jenis,
      count,
      color: DONUT_COLORS[i % DONUT_COLORS.length],
      dashArray: `${dash} ${CIRC - dash}`,
      rotate: cumulative * 360,
    };
    cumulative += fraction;
    return seg;
  });

  return (
    <AppShell
      active="dashboard"
      email={user?.email}
      subtitle="Ringkasan Bank Regulasi Dana BOSP"
      showAddButton={false}
      dark
    >
      {/* Hero — cinematic deep navy / royal blue banner */}
      <div
        className="relative overflow-hidden rounded-[20px] text-white mb-6 border"
        style={{
          borderColor: "rgba(255,255,255,0.10)",
          boxShadow: "0 20px 60px rgba(3,12,30,0.45)",
        }}
      >
        {/* Foto Kantor Inspektorat — dibentangkan penuh mengisi seluruh
            lebar & tinggi banner (bukan contain/cover) sesuai permintaan. */}
        <div
          className="pointer-events-none absolute inset-0 bg-no-repeat bg-center"
          style={{ backgroundImage: "url(/dashboard-bg.jpg)", backgroundSize: "100% 100%" }}
        />
        {/* Tint tipis supaya foto tetap terlihat, teks tetap kontras */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(120deg, rgba(10,35,72,0.72) 0%, rgba(18,58,114,0.55) 55%, rgba(14,44,90,0.72) 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 pattern-dots opacity-[0.06]" />
        <div className="pointer-events-none absolute -top-16 right-10 w-72 h-72 rounded-full opacity-25 blur-3xl bg-accent" />
        <div className="pointer-events-none absolute bottom-[-40%] left-[10%] w-64 h-64 rounded-full opacity-15 blur-3xl bg-cyan" />

        {/* Abstract government-building line art */}
        <svg
          className="pointer-events-none absolute right-0 bottom-0 h-full w-[46%] max-w-[420px] opacity-[0.10]"
          viewBox="0 0 420 220"
          fill="none"
          preserveAspectRatio="xMaxYMax meet"
        >
          <polygon points="210,18 260,60 160,60" stroke="white" strokeWidth="1.4" />
          <rect x="150" y="60" width="120" height="10" stroke="white" strokeWidth="1.4" />
          {[170, 190, 210, 230, 250].map((x) => (
            <line key={x} x1={x} y1="72" x2={x} y2="150" stroke="white" strokeWidth="1.4" />
          ))}
          <rect x="150" y="150" width="120" height="10" stroke="white" strokeWidth="1.4" />
          <line x1="130" y1="170" x2="290" y2="170" stroke="white" strokeWidth="1.4" />
          <path d="M0 200 C 80 180, 160 210, 240 190 S 380 175, 420 195" stroke="#5BC8FF" strokeWidth="1.2" opacity="0.8" />
          <path d="M0 210 C 90 195, 170 218, 260 200 S 390 188, 420 205" stroke="#5B93FF" strokeWidth="1.2" opacity="0.6" />
        </svg>

        <div className="relative px-5 sm:px-8 py-7 sm:py-9">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="min-w-0 flex-1 overflow-hidden">
              <div className="marquee-track flex flex-col items-start">
                <p className="text-xs tracking-[0.15em] uppercase text-white/55 mb-2 flex items-center gap-2 whitespace-nowrap">
                  {greeting}, {displayName}
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight whitespace-nowrap">
                  Bank Regulasi Dana BOSP
                </h2>
                <p className="text-sm text-white/65 mt-1.5 whitespace-nowrap">
                  Pengawasan Dana BOSP — Inspektur Pembantu Wilayah IV
                </p>
              </div>
            </div>
            <Link
              href="/regulasi/baru"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-accent to-cyan text-white text-sm font-semibold px-4 py-2.5 shadow-glow hover:brightness-110 hover:-translate-y-0.5 transition-all self-start"
            >
              <Plus size={16} strokeWidth={2.4} />
              Tambah Regulasi
            </Link>
          </div>
        </div>
      </div>

      {/* KPI stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Regulasi", value: total, tone: "primary" as const, caption: "Seluruh regulasi terdaftar" },
          { label: "Berlaku", value: berlaku, tone: "berlaku" as const, caption: "Masih berlaku aktif" },
          { label: "Ditinjau", value: ditinjau, tone: "ditinjau" as const, caption: "Sedang ditinjau ulang" },
          { label: "Dicabut", value: dicabut, tone: "dicabut" as const, caption: "Sudah tidak berlaku" },
        ].map((k, i) => (
          <div
            key={k.label}
            className="opacity-0 animate-[fadeup_0.5s_ease_forwards]"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <StatCard label={k.label} value={k.value} tone={k.tone} caption={k.caption} />
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4 mb-6">
        {/* Sebaran per Jenis Regulasi — donut chart, dark glass panel */}
        <div className="surface-card-dark lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm text-white">
              Sebaran per Jenis Regulasi
            </h3>
            <Link
              href="/regulasi"
              className="text-xs font-medium text-cyan hover:text-white flex items-center gap-1 transition-colors"
            >
              Lihat semua <ArrowUpRight size={13} />
            </Link>
          </div>

          {jenisBreakdown.length === 0 ? (
            <p className="text-sm text-white/40 py-6 text-center">Belum ada data.</p>
          ) : (
            <div className="flex flex-col items-center gap-5">
              <div className="relative w-40 h-40 shrink-0">
                <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
                  <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={STROKE} />
                  {donutSegments.map((s) => (
                    <circle
                      key={s.jenis}
                      cx="70"
                      cy="70"
                      r={R}
                      fill="none"
                      stroke={s.color}
                      strokeWidth={STROKE}
                      strokeDasharray={s.dashArray}
                      strokeLinecap="butt"
                      transform={`rotate(${s.rotate} 70 70)`}
                      style={{ transition: "stroke-dasharray 0.6s ease" }}
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-3xl font-extrabold text-white leading-none">
                    {total}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-white/40 mt-1">
                    Total
                  </span>
                </div>
              </div>

              <div className="w-full space-y-2.5">
                {donutSegments.map((s) => (
                  <Link
                    key={s.jenis}
                    href={`/regulasi?jenis=${encodeURIComponent(s.jenis)}`}
                    className="flex items-center gap-2.5 group"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-xs text-white/70 group-hover:text-white transition-colors truncate flex-1">
                      {s.jenis}
                    </span>
                    <span className="text-xs font-semibold text-white/90">{s.count}</span>
                    <span className="text-[10px] text-white/35 w-9 text-right">
                      {total > 0 ? Math.round((s.count / total) * 100) : 0}%
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Regulasi Terbaru — dark glass panel */}
        <div className="surface-card-dark lg:col-span-3 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm text-white">
              Regulasi Terbaru
            </h3>
            <Link
              href="/regulasi"
              className="text-xs font-medium text-cyan hover:text-white flex items-center gap-1 transition-colors"
            >
              Lihat semua <ArrowUpRight size={13} />
            </Link>
          </div>

          {recentList.length === 0 ? (
            <EmptyState
              icon={FileSearch}
              title="Belum ada regulasi terdaftar"
              actionLabel="Tambah Regulasi"
              actionHref="/regulasi/baru"
              dark
            />
          ) : (
            <div className="flex flex-col gap-3">
              {recentList.map((r) => {
                const StatusIcon = STATUS_ICON[r.status];
                const dot = STATUS_DOT[r.status];
                return (
                  <Link
                    key={r.id}
                    href={`/regulasi/${r.id}`}
                    className="group flex items-start gap-3 rounded-xl px-4 py-3.5 border transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderColor: "rgba(255,255,255,0.08)",
                    }}
                  >
                    <span
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg shrink-0 mt-0.5"
                      style={{ backgroundColor: `${dot}1F`, color: dot, border: `1px solid ${dot}33` }}
                    >
                      <FileText size={16} strokeWidth={1.9} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] text-white/40">
                          {r.nomor_regulasi || "Tanpa nomor"} · {r.tahun}
                        </span>
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold shrink-0"
                          style={{ backgroundColor: `${dot}1F`, color: dot }}
                        >
                          <StatusIcon size={11} strokeWidth={2.4} />
                          {STATUS_LABEL[r.status]}
                        </span>
                      </div>
                      <h4 className="font-display font-semibold text-[14px] text-white leading-snug truncate mt-0.5 group-hover:text-cyan transition-colors">
                        {r.judul}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/40 mt-1">
                        <span>{r.jenis}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="flex items-center gap-1">
                          <Building2 size={11} /> {r.instansi_penerbit}
                        </span>
                        {r.file_path && (
                          <span className="flex items-center gap-1">
                            <Paperclip size={11} /> Dokumen
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="text-white/25 group-hover:text-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1"
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
