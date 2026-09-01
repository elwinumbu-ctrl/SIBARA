import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import RegulasiCard from "@/components/RegulasiCard";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";
import { Regulasi } from "@/lib/types";
import { ArrowUpRight, FileSearch, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

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
  const maxJenisCount = Math.max(1, ...jenisBreakdown.map(([, c]) => c));

  const recentList = (recent ?? []) as Regulasi[];

  const displayName = user?.email?.split("@")[0] ?? "Auditor";
  const hour = new Date().getHours();
  const greeting =
    hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 18 ? "Selamat sore" : "Selamat malam";

  return (
    <AppShell
      active="dashboard"
      email={user?.email}
      subtitle="Ringkasan Bank Regulasi Dana BOSP"
      showAddButton={false}
    >
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-primary text-white mb-6">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)",
            backgroundSize: "18px 18px",
          }}
        />
        <div
          className="pointer-events-none absolute -top-16 right-0 w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: "#155EEF" }}
        />
        <div className="relative px-5 sm:px-8 py-7 sm:py-9">
          <p className="text-xs tracking-[0.15em] uppercase text-white/55 mb-2">
            {greeting}, {displayName}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight">
                Bank Regulasi Dana BOSP
              </h2>
              <p className="text-sm text-white/70 mt-1.5">
                Pengawasan Dana BOSP — Inspektur Pembantu Wilayah IV
              </p>
            </div>
            <Link
              href="/regulasi/baru"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/25 text-white text-sm font-semibold px-4 py-2.5 hover:bg-white/20 hover:border-white/40 transition-all shadow-lg shadow-black/10 self-start"
            >
              <Plus size={16} strokeWidth={2.4} />
              Tambah Regulasi
            </Link>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Regulasi" value={total} tone="primary" caption="Seluruh regulasi terdaftar" />
        <StatCard label="Berlaku" value={berlaku} tone="berlaku" caption="Masih berlaku aktif" />
        <StatCard label="Ditinjau" value={ditinjau} tone="ditinjau" caption="Sedang ditinjau ulang" />
        <StatCard label="Dicabut" value={dicabut} tone="dicabut" caption="Sudah tidak berlaku" />
      </div>

      <div className="grid lg:grid-cols-5 gap-4 mb-6">
        {/* Breakdown per jenis */}
        <div className="lg:col-span-2 bg-white border border-border rounded-2xl shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm text-ink">
              Sebaran per Jenis Regulasi
            </h3>
            <Link
              href="/regulasi"
              className="text-xs font-medium text-accent hover:text-accent-600 flex items-center gap-1"
            >
              Lihat semua <ArrowUpRight size={13} />
            </Link>
          </div>
          {jenisBreakdown.length === 0 ? (
            <p className="text-sm text-ink-faint py-6 text-center">Belum ada data.</p>
          ) : (
            <div className="space-y-3">
              {jenisBreakdown.map(([jenis, count]) => (
                <Link
                  key={jenis}
                  href={`/regulasi?jenis=${encodeURIComponent(jenis)}`}
                  className="group flex items-center gap-3"
                >
                  <span className="text-xs text-ink-muted w-32 sm:w-36 shrink-0 truncate group-hover:text-accent transition-colors">
                    {jenis}
                  </span>
                  <span className="flex-1 h-2 rounded-full bg-surface-subtle overflow-hidden">
                    <span
                      className="block h-full rounded-full bg-accent/70"
                      style={{ width: `${(count / maxJenisCount) * 100}%` }}
                    />
                  </span>
                  <span className="text-xs text-ink-faint w-6 text-right shrink-0">{count}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent regulasi */}
        <div className="lg:col-span-3 bg-white border border-border rounded-2xl shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm text-ink">
              Regulasi Terbaru
            </h3>
            <Link
              href="/regulasi"
              className="text-xs font-medium text-accent hover:text-accent-600 flex items-center gap-1"
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
            />
          ) : (
            <div className="flex flex-col gap-3">
              {recentList.map((r) => (
                <RegulasiCard key={r.id} regulasi={r} view="list" />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
