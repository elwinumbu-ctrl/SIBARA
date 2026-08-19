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

  return (
    <div className="min-h-screen">
      <Navbar email={user?.email} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl text-ink">Bank Regulasi</h1>
            <p className="text-sm text-slate-muted mt-1">
              Pengawasan Dana BOSP — Inspektur Pembantu Wilayah IV
            </p>
          </div>
          <Link
            href="/regulasi/baru"
            className="sm:hidden inline-flex items-center rounded-md bg-ink text-paper-card text-sm font-medium px-3.5 py-2"
          >
            + Tambah
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total Regulasi" value={total} />
          <StatCard label="Berlaku" value={berlaku} />
          <StatCard label="Ditinjau" value={ditinjau} accent />
          <StatCard label="Dicabut" value={dicabut} />
        </div>

        <SearchFilterBar tahunList={tahunList} />

        {error && (
          <p className="text-sm text-status-dicabut bg-status-dicabut/10 rounded-md px-4 py-3 mb-4">
            Gagal memuat data: {error.message}
          </p>
        )}

        {list.length === 0 && !error ? (
          <div className="text-center py-16 bg-paper-card border border-dashed border-paper-line rounded-lg">
            <p className="font-display text-lg text-ink mb-1">
              Belum ada regulasi yang cocok
            </p>
            <p className="text-sm text-slate-muted mb-4">
              Ubah kata kunci atau filter, atau tambahkan regulasi baru ke
              dalam bank regulasi.
            </p>
            <Link
              href="/regulasi/baru"
              className="inline-flex items-center rounded-md bg-ink text-paper-card text-sm font-medium px-4 py-2"
            >
              + Tambah Regulasi
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
