import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import PageHero from "@/components/PageHero";
import EmptyState from "@/components/EmptyState";
import { JENIS_REGULASI } from "@/lib/types";
import { Layers, ArrowUpRight, FolderOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function JenisPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase.from("regulasi").select("jenis");
  const counts: Record<string, number> = {};
  (data ?? []).forEach((r) => {
    counts[r.jenis] = (counts[r.jenis] ?? 0) + 1;
  });

  // Include any jenis value present in the data but not in the canonical
  // list, so nothing on record is hidden from this master-data view.
  const allJenis = [
    ...JENIS_REGULASI,
    ...Object.keys(counts).filter((j) => !JENIS_REGULASI.includes(j)),
  ];

  return (
    <AppShell
      active="jenis"
      email={user?.email}
      subtitle="Kelola jenis regulasi"
      dark
    >
      <PageHero
        icon={Layers}
        eyebrow="Master Data"
        title="Jenis Regulasi"
        description="Telusuri regulasi berdasarkan jenisnya."
      />
      {allJenis.length === 0 ? (
        <EmptyState icon={Layers} title="Belum ada jenis regulasi" dark />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allJenis.map((j) => (
            <Link
              key={j}
              href={`/regulasi?jenis=${encodeURIComponent(j)}`}
              className="group surface-card-dark hover:border-cyan/30 hover-lift p-5 flex items-start gap-4"
            >
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-cyan/10 text-cyan shrink-0">
                <FolderOpen size={19} strokeWidth={1.9} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-semibold text-[15px] text-white group-hover:text-cyan transition-colors">
                  {j}
                </h3>
                <p className="text-xs text-white/40 mt-1">
                  {counts[j] ?? 0} regulasi terdaftar
                </p>
              </div>
              <ArrowUpRight
                size={16}
                className="text-white/30 group-hover:text-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1"
              />
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
