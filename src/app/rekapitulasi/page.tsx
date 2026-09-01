import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import PageHero from "@/components/PageHero";
import { KATEGORI_REGULASI } from "@/lib/types";
import { PieChart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RekapitulasiPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase.from("regulasi").select("kategori, status, tahun");
  const rows = data ?? [];

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

  return (
    <AppShell
      active="rekapitulasi"
      email={user?.email}
      subtitle="Rekapitulasi statistik regulasi Dana BOSP"
      showAddButton={false}
      dark
    >
      <PageHero
        icon={PieChart}
        eyebrow="Statistik"
        title="Rekapitulasi Regulasi"
        description="Ringkasan komposisi status dan kategori seluruh regulasi Dana BOSP."
      />
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
    </AppShell>
  );
}
