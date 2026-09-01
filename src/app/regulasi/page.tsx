import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import SearchFilterBar from "@/components/SearchFilterBar";
import ViewToggle from "@/components/ViewToggle";
import RegulasiFolderGroups from "@/components/RegulasiFolderGroups";
import Link from "next/link";
import { Regulasi } from "@/lib/types";
import { FileSearch, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RegulasiPage({
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

  const { data: allRegulasi } = await supabase.from("regulasi").select("tahun");

  const tahunList = Array.from(
    new Set((allRegulasi ?? []).map((r) => r.tahun))
  ).sort((a, b) => b - a);

  const total = allRegulasi?.length ?? 0;
  const list = (regulasiList ?? []) as Regulasi[];
  const isFiltered = Boolean(
    searchParams.q || searchParams.jenis || searchParams.kategori || searchParams.tahun || searchParams.status
  );
  const view = searchParams.view === "list" ? "list" : "grid";

  return (
    <AppShell
      active="regulasi"
      email={user?.email}
      subtitle="Seluruh regulasi, dikelompokkan per jenis"
    >
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
      ) : (
        <RegulasiFolderGroups list={list} view={view} activeJenis={searchParams.jenis} />
      )}
    </AppShell>
  );
}
