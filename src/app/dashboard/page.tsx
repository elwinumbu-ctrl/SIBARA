import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import SearchFilterBar from "@/components/SearchFilterBar";
import StatCard from "@/components/StatCard";
import RegulasiCard from "@/components/RegulasiCard";
import ViewToggle from "@/components/ViewToggle";
import Link from "next/link";
import { Regulasi } from "@/lib/types";
import { FileSearch, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from("regulasi")
    .select("*")
    .order("created_at", { ascending: false });

  if (searchParams.q) {
    query = query.or(
      `judul.ilike.%${searchParams.q}%,nomor_regulasi.ilike.%${searchParams.q}%`
    );
  }
  if (searchParams.jenis) query = query.eq("jenis", searchParams.jenis);
  if (searchParams.kategori) query = query.eq("kategori", searchParams.kategori);
  if (searchParams.tahun) query = query.eq("tahun", Number(searchParams.tahun));
  if (searchParams.status) query = query.eq("status", searchParams.status);

  const { data: regulasiList, error } = await query;

  const { data: allRegulasi } = await supabase
    .from("regulasi")
    .select("tahun, status");

  const tahunList = Array.from(
    new Set((allRegulasi ?? []).map((r) => r.tahun))
  ).sort((a, b) => b - a);

  const total = allRegulasi?.length ?? 0;
  const berlaku = (allRegulasi ?? []).filter((r) => r.status === "berlaku").length;
  const ditinjau = (allRegulasi ?? []).filter((r) => r.status === "ditinjau").length;
  const dicabut = (allRegulasi ?? []).filter((r) => r.status === "dicabut").length;

  const list = (regulasiList ?? []) as Regulasi[];
  const isFiltered = Boolean(
    searchParams.q || searchParams.jenis || searchParams.kategori || searchParams.tahun || searchParams.status
  );
  const view = searchParams.view === "list" ? "list" : "grid";

  const displayName = user?.email?.split("@")[0] ?? "Auditor";
  const hour = new Date().getHours();
  const greeting =
    hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 18 ? "Selamat sore" : "Selamat malam";

  return (
    <AppShell active="dashboard" email={user?.email} subtitle="Ringkasan Bank Regulasi Dana BOSP">
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
          style={{ backgroundColor: "#B8862E" }}
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
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent text-white text-sm font-semibold px-4 py-2.5 hover:bg-accent-light transition-colors shadow-lg shadow-black/10 self-start"
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

      <SearchFilterBar tahunList={tahunList} />

      {error && (
        <p className="text-sm text-status-dicabut bg-status-dicabut-bg rounded-lg px-4 py-3 mb-4">
          Gagal memuat data: {error.message}
        </p>
      )}

      {!error && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-ink-subtle">
            Menampilkan{" "}
            <span className="font-semibold text-ink">{list.length}</span>{" "}
            dari <span className="font-semibold text-ink">{total}</span> regulasi
            {isFiltered ? " (terfilter)" : ""}
          </p>
          <ViewToggle view={view} />
        </div>
      )}

      {list.length === 0 && !error ? (
        <div className="text-center py-16 bg-white border border-dashed border-border-strong rounded-2xl">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/8 text-primary mb-4">
            <FileSearch size={22} strokeWidth={1.7} />
          </div>
          <p className="font-display font-semibold text-lg text-ink mb-1">
            Belum ada regulasi yang cocok
          </p>
          <p className="text-sm text-ink-subtle mb-4 max-w-sm mx-auto">
            Ubah kata kunci atau filter, atau tambahkan regulasi baru ke
            dalam bank regulasi.
          </p>
          <Link
            href="/regulasi/baru"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-white text-sm font-medium px-4 py-2 hover:bg-primary-600 transition-colors"
          >
            <Plus size={15} strokeWidth={2.2} />
            Tambah Regulasi
          </Link>
        </div>
      ) : view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((r) => (
            <RegulasiCard key={r.id} regulasi={r} view="grid" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((r) => (
            <RegulasiCard key={r.id} regulasi={r} view="list" />
          ))}
        </div>
      )}
    </AppShell>
  );
}
