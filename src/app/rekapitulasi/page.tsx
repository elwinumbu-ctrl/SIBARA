import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import PageHero from "@/components/PageHero";
import StatusBadge from "@/components/StatusBadge";
import SearchFilterBar from "@/components/SearchFilterBar";
import EmptyState from "@/components/EmptyState";
import { KATEGORI_REGULASI, Regulasi } from "@/lib/types";
import { PieChart, ClipboardList, Printer, FileSearch } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

// "Laporan Regulasi" sekarang digabung ke dalam "Rekapitulasi" sebagai
// sub-menu (tab), bukan menu terpisah di sidebar. Navigasi antar tab
// memakai query string ?tab=... supaya tetap bisa di-bookmark & di-refresh.
const TABS = [
  { key: "ringkasan", label: "Rekapitulasi", icon: PieChart },
  { key: "laporan", label: "Laporan Regulasi", icon: ClipboardList },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default async function RekapitulasiPage({
  searchParams,
}: {
  searchParams: {
    tab?: string;
    q?: string;
    jenis?: string;
    kategori?: string;
    tahun?: string;
    status?: string;
  };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const activeTab: TabKey = searchParams.tab === "laporan" ? "laporan" : "ringkasan";

  const { data } = await supabase
    .from("regulasi")
    .select("*")
    .order("tahun", { ascending: false });

  const rows = (data ?? []) as Regulasi[];

  // Daftar tahun unik untuk dropdown filter di tab Laporan Regulasi.
  const tahunList = Array.from(new Set(rows.map((r) => r.tahun))).sort((a, b) => b - a);

  // Filter tabel Laporan Regulasi (tidak memengaruhi statistik ringkasan
  // di tab Rekapitulasi, yang selalu menghitung dari seluruh data).
  const q = searchParams.q?.trim().toLowerCase() ?? "";
  const isFiltered = Boolean(
    searchParams.q || searchParams.jenis || searchParams.kategori || searchParams.tahun || searchParams.status
  );
  const laporanRows = rows.filter((r) => {
    if (q) {
      const inJudul = r.judul?.toLowerCase().includes(q);
      const inNomor = r.nomor_regulasi?.toLowerCase().includes(q);
      if (!inJudul && !inNomor) return false;
    }
    if (searchParams.jenis && r.jenis !== searchParams.jenis) return false;
    if (searchParams.kategori && r.kategori !== searchParams.kategori) return false;
    if (searchParams.tahun && String(r.tahun) !== searchParams.tahun) return false;
    if (searchParams.status && r.status !== searchParams.status) return false;
    return true;
  });

  const total = rows.length;
  const statusCounts = { berlaku: 0, ditinjau: 0, dicabut: 0 } as Record<string, number>;
  rows.forEach((r) => (statusCounts[r.status] = (statusCounts[r.status] ?? 0) + 1));

  const kategoriCounts: Record<string, number> = {};
  KATEGORI_REGULASI.forEach((k) => (kategoriCounts[k] = 0));
  rows.forEach((r) => (kategoriCounts[r.kategori] = (kategoriCounts[r.kategori] ?? 0) + 1));
  const maxKategori = Math.max(1, ...Object.values(kategoriCounts));

  const STATUS_COLOR: Record<string, string> = {
    berlaku: "#22C55E",
    ditinjau: "#F59E0B",
    dicabut: "#EF4444",
  };

  const isLaporan = activeTab === "laporan";

  return (
    <AppShell
      active="rekapitulasi"
      email={user?.email}
      subtitle={
        isLaporan
          ? "Daftar lengkap regulasi untuk keperluan pelaporan audit"
          : "Rekapitulasi statistik regulasi Dana BOSP"
      }
      showAddButton={false}
      dark
    >
      <PageHero
        icon={isLaporan ? ClipboardList : PieChart}
        eyebrow={isLaporan ? "Pelaporan" : "Statistik"}
        title={isLaporan ? "Laporan Regulasi" : "Rekapitulasi Regulasi"}
        description={
          isLaporan
            ? "Daftar lengkap regulasi untuk keperluan pelaporan audit."
            : "Ringkasan komposisi status dan kategori seluruh regulasi Dana BOSP."
        }
      />

      {/* Sub-menu: Rekapitulasi <-> Laporan Regulasi */}
      <div className="mb-5 inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.key === activeTab;
          return (
            <Link
              key={tab.key}
              href={tab.key === "ringkasan" ? "/rekapitulasi" : "/rekapitulasi?tab=laporan"}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gradient-to-r from-accent to-cyan text-white shadow-glow"
                  : "text-white/55 hover:text-white hover:bg-white/8"
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {isLaporan ? (
        <>
          <SearchFilterBar tahunList={tahunList} dark />

          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-white/50">
              Menampilkan <span className="font-semibold text-white">{laporanRows.length}</span> dari{" "}
              <span className="font-semibold text-white">{total}</span> regulasi
              {isFiltered ? " (terfilter)" : ""}
            </p>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 text-white/60 hover:bg-white/10 hover:text-white text-sm font-medium px-3.5 py-2 transition-colors print:hidden">
              <Printer size={14} />
              Cetak
            </button>
          </div>

          {laporanRows.length === 0 ? (
            <EmptyState
              icon={FileSearch}
              title="Belum ada regulasi yang cocok"
              description={
                isFiltered
                  ? "Ubah kata kunci atau filter untuk melihat regulasi lainnya."
                  : "Belum ada data regulasi."
              }
              dark
            />
          ) : (
            <div className="surface-card-dark overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/5 text-left text-[11px] font-semibold uppercase tracking-wide text-white/50">
                      <th className="px-4 py-3 font-semibold">Nomor / Tahun</th>
                      <th className="px-4 py-3 font-semibold">Judul Regulasi</th>
                      <th className="px-4 py-3 font-semibold hidden md:table-cell">Jenis</th>
                      <th className="px-4 py-3 font-semibold hidden lg:table-cell">Kategori</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {laporanRows.map((r) => (
                      <tr key={r.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-white/40 whitespace-nowrap">
                          {r.nomor_regulasi || "—"} · {r.tahun}
                        </td>
                        <td className="px-4 py-3 text-white font-medium max-w-xs truncate">{r.judul}</td>
                        <td className="px-4 py-3 text-white/55 hidden md:table-cell">{r.jenis}</td>
                        <td className="px-4 py-3 text-white/55 hidden lg:table-cell">{r.kategori}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={r.status} size="sm" dark />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Status donut-ish breakdown */}
          <div className="lg:col-span-2 surface-card-dark p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <PieChart size={16} className="text-cyan" />
              <h3 className="font-display font-semibold text-sm text-white">
                Komposisi Status
              </h3>
            </div>

            <div className="flex h-3 rounded-full overflow-hidden mb-5 bg-white/8">
              {(["berlaku", "ditinjau", "dicabut"] as const).map((s) => (
                <span
                  key={s}
                  style={{
                    width: total ? `${(statusCounts[s] / total) * 100}%` : "0%",
                    backgroundColor: STATUS_COLOR[s],
                  }}
                />
              ))}
            </div>

            <div className="space-y-3">
              {(["berlaku", "ditinjau", "dicabut"] as const).map((s) => (
                <div key={s} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-white/60 capitalize">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: STATUS_COLOR[s] }}
                    />
                    {s}
                  </span>
                  <span className="font-semibold text-white">
                    {statusCounts[s]}{" "}
                    <span className="text-white/40 font-normal">
                      ({total ? Math.round((statusCounts[s] / total) * 100) : 0}%)
                    </span>
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/50">Total regulasi</span>
              <span className="font-display text-xl font-bold text-white">{total}</span>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="lg:col-span-3 surface-card-dark p-5 sm:p-6">
            <h3 className="font-display font-semibold text-sm text-white mb-5">
              Regulasi per Kategori
            </h3>
            <div className="space-y-3.5">
              {KATEGORI_REGULASI.map((k) => (
                <div key={k} className="flex items-center gap-3">
                  <span className="text-xs text-white/55 w-40 shrink-0 truncate">{k}</span>
                  <span className="flex-1 h-2 rounded-full bg-white/8 overflow-hidden">
                    <span
                      className="block h-full rounded-full bg-gradient-to-r from-accent to-cyan"
                      style={{ width: `${(kategoriCounts[k] / maxKategori) * 100}%` }}
                    />
                  </span>
                  <span className="text-xs font-semibold text-white w-6 text-right shrink-0">
                    {kategoriCounts[k]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
