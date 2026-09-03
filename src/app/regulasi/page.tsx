import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import PageHero from "@/components/PageHero";
import SearchFilterBar from "@/components/SearchFilterBar";
import ViewToggle from "@/components/ViewToggle";
import RegulasiFolderGroups from "@/components/RegulasiFolderGroups";
import EmptyState from "@/components/EmptyState";
import { Regulasi } from "@/lib/types";
import { FileSearch, FileText } from "lucide-react";

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
  const isGuest = Boolean(user?.is_anonymous);

  return (
    <AppShell
      active="regulasi"
      email={user?.email}
      subtitle="Seluruh regulasi, dikelompokkan per jenis"
      isGuest={isGuest}
      dark
    >
      <PageHero
        icon={FileText}
        eyebrow="Bank Regulasi"
        title="Seluruh Regulasi"
        description={
          isGuest
            ? "Telusuri dan saring seluruh regulasi Dana BOSP yang terdaftar (lihat-saja)."
            : "Telusuri, saring, dan kelola seluruh regulasi Dana BOSP yang terdaftar."
        }
        {...(isGuest ? {} : { actionHref: "/regulasi/baru", actionLabel: "Tambah Regulasi" })}
      />

      <SearchFilterBar tahunList={tahunList} dark />

      {error && (
        <p className="text-sm text-status-dicabut bg-status-dicabut/10 border border-status-dicabut/20 rounded-lg px-4 py-3 mb-4">
          Gagal memuat data: {error.message}
        </p>
      )}

      {!error && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-white/50">
            Menampilkan{" "}
            <span className="font-semibold text-white">{list.length}</span>{" "}
            dari <span className="font-semibold text-white">{total}</span> regulasi
            {isFiltered ? " (terfilter)" : ""}
          </p>
          <ViewToggle view={view} dark />
        </div>
      )}

      {list.length === 0 && !error ? (
        <EmptyState
          icon={FileSearch}
          title="Belum ada regulasi yang cocok"
          description={
            isGuest
              ? "Ubah kata kunci atau filter untuk melihat regulasi lainnya."
              : "Ubah kata kunci atau filter, atau tambahkan regulasi baru ke dalam bank regulasi."
          }
          {...(isGuest ? {} : { actionLabel: "Tambah Regulasi", actionHref: "/regulasi/baru" })}
          dark
        />
      ) : (
        <RegulasiFolderGroups list={list} view={view} activeJenis={searchParams.jenis} dark />
      )}
    </AppShell>
  );
}
