import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import SearchFilterBar from "@/components/SearchFilterBar";
import ViewToggle from "@/components/ViewToggle";
import RegulasiFolderGroups from "@/components/RegulasiFolderGroups";
import EmptyState from "@/components/EmptyState";
import { Regulasi } from "@/lib/types";
import { FileSearch } from "lucide-react";

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
        <EmptyState
          icon={FileSearch}
          title="Belum ada regulasi yang cocok"
          description="Ubah kata kunci atau filter, atau tambahkan regulasi baru ke dalam bank regulasi."
          actionLabel="Tambah Regulasi"
          actionHref="/regulasi/baru"
        />
      ) : (
        <RegulasiFolderGroups list={list} view={view} activeJenis={searchParams.jenis} />
      )}
    </AppShell>
  );
}
