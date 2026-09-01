import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
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
    >
      {allJenis.length === 0 ? (
        <EmptyState icon={Layers} title="Belum ada jenis regulasi" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allJenis.map((j) => (
            <Link
              key={j}
              href={`/regulasi?jenis=${encodeURIComponent(j)}`}
              className="group bg-white/95 backdrop-blur-sm border border-white/70 rounded-2xl shadow-panel hover:shadow-card-hover hover:border-accent/30 hover-lift p-5 flex items-start gap-4"
            >
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-accent/8 text-accent shrink-0">
                <FolderOpen size={19} strokeWidth={1.9} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-semibold text-[15px] text-ink group-hover:text-accent transition-colors">
                  {j}
                </h3>
                <p className="text-xs text-ink-faint mt-1">
                  {counts[j] ?? 0} regulasi terdaftar
                </p>
              </div>
              <ArrowUpRight
                size={16}
                className="text-ink-faint group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1"
              />
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
