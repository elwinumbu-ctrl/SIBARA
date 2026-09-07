import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import PageHero from "@/components/PageHero";
import StatusBadge from "@/components/StatusBadge";
import { Regulasi } from "@/lib/types";
import { ClipboardList, Printer } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LaporanPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("regulasi")
    .select("*")
    .order("tahun", { ascending: false });

  const list = (data ?? []) as Regulasi[];

  return (
    <AppShell
      active="laporan"
      email={user?.email}
      subtitle="Daftar lengkap regulasi untuk keperluan pelaporan audit"
      showAddButton={false}
      dark
    >
      <PageHero
        icon={ClipboardList}
        eyebrow="Pelaporan"
        title="Laporan Regulasi"
        description="Daftar lengkap regulasi untuk keperluan pelaporan audit."
      />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-white/55">
          <ClipboardList size={16} className="text-cyan" />
          <span>
            Total <span className="font-semibold text-white">{list.length}</span> regulasi tercatat
          </span>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 text-white/60 hover:bg-white/10 hover:text-white text-sm font-medium px-3.5 py-2 transition-colors print:hidden">
          <Printer size={14} />
          Cetak
        </button>
      </div>

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
              {list.map((r) => (
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
              {list.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-white/50">
                    Belum ada data regulasi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
