import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import SearchFilterBar from "@/components/SearchFilterBar";
import StatCard from "@/components/StatCard";
import RegulasiCard from "@/components/RegulasiCard";
import Link from "next/link";
import { Regulasi } from "@/lib/types";

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

  const displayName = user?.email?.split("@")[0] ?? "Auditor";
  const hour = new Date().getHours();
  const greeting =
    hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 18 ? "Selamat sore" : "Selamat malam";

  return (
    <div className="min-h-screen">
      <Navbar email={user?.email} />

      {/* Hero header */}
      <div className="relative overflow-hidden bg-ink-dark text-paper-card">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #FBF9F4 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        <div
          className="pointer-events-none absolute -top-20 right-0 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: "#B8862E" }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-10">
          <p className="text-xs tracking-[0.15em] uppercase text-paper-card/60 mb-2">
            {greeting}, {displayName}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl leading-tight">Bank Regulasi</h1>
              <p className="text-sm text-paper-card/70 mt-1.5">
                Pengawasan Dana BOSP — Inspektur Pembantu Wilayah IV
              </p>
            </div>
            <Link
              href="/regulasi/baru"
              className="inline-flex items-center gap-1.5 rounded-lg bg-seal text-ink-dark text-sm font-semibold px-4 py-2.5 hover:bg-seal-light transition-colors shadow-lg shadow-black/10 self-start"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Tambah Regulasi
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 -mt-14 relative">
          <StatCard label="Total Regulasi" value={total} tone="ink" />
          <StatCard label="Berlaku" value={berlaku} tone="berlaku" />
          <StatCard label="Ditinjau" value={ditinjau} tone="ditinjau" />
          <StatCard label="Dicabut" value={dicabut} tone="dicabut" />
        </div>

        <SearchFilterBar tahunList={tahunList} />

        {error && (
          <p className="text-sm text-status-dicabut bg-status-dicabut/10 rounded-md px-4 py-3 mb-4">
            Gagal memuat data: {error.message}
          </p>
        )}

        {!error && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-slate-muted">
              Menampilkan{" "}
              <span className="font-medium text-slate-text">{list.length}</span>{" "}
              dari <span className="font-medium text-slate-text">{total}</span> regulasi
              {isFiltered ? " (terfilter)" : ""}
            </p>
          </div>
        )}

        {list.length === 0 && !error ? (
          <div className="text-center py-16 bg-paper-card border border-dashed border-paper-line rounded-xl">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ink/5 text-ink mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 5.5a1.5 1.5 0 0 1 1.5-1.5h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13Z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 9h8M8 13h5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="font-display text-lg text-ink mb-1">
              Belum ada regulasi yang cocok
            </p>
            <p className="text-sm text-slate-muted mb-4 max-w-sm mx-auto">
              Ubah kata kunci atau filter, atau tambahkan regulasi baru ke
              dalam bank regulasi.
            </p>
            <Link
              href="/regulasi/baru"
              className="inline-flex items-center gap-1.5 rounded-md bg-ink text-paper-card text-sm font-medium px-4 py-2 hover:bg-ink-light transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Tambah Regulasi
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((r) => (
              <RegulasiCard key={r.id} regulasi={r} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
