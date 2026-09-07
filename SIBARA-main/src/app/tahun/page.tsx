import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import PageHero from "@/components/PageHero";
import EmptyState from "@/components/EmptyState";
import { CalendarRange, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TahunPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase.from("regulasi").select("tahun");
  const counts: Record<number, number> = {};
  (data ?? []).forEach((r) => {
    counts[r.tahun] = (counts[r.tahun] ?? 0) + 1;
  });
  const tahunList = Object.keys(counts)
    .map(Number)
    .sort((a, b) => b - a);
  const maxCount = Math.max(1, ...Object.values(counts));

  return (
    <AppShell
      active="tahun"
      email={user?.email}
      subtitle="Ringkasan regulasi berdasarkan tahun terbit"
      dark
    >
      <PageHero
        icon={CalendarRange}
        eyebrow="Master Data"
        title="Tahun Terbit"
        description="Telusuri regulasi berdasarkan tahun penerbitannya."
      />
      {tahunList.length === 0 ? (
        <EmptyState icon={CalendarRange} title="Belum ada data regulasi" dark />
      ) : (
        <div className="surface-card-dark p-5 sm:p-6">
          <div className="space-y-3">
            {tahunList.map((t) => (
              <Link
                key={t}
                href={`/regulasi?tahun=${t}`}
                className="group flex items-center gap-4 rounded-xl px-3 py-3 hover:bg-white/5 transition-colors"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cyan/10 text-cyan shrink-0">
                  <CalendarRange size={17} strokeWidth={1.9} />
                </span>
                <span className="font-display font-semibold text-sm text-white w-14 shrink-0 group-hover:text-cyan transition-colors">
                  {t}
                </span>
                <span className="flex-1 h-2 rounded-full bg-white/8 overflow-hidden">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-accent to-cyan"
                    style={{ width: `${(counts[t] / maxCount) * 100}%` }}
                  />
                </span>
                <span className="text-xs text-white/40 w-24 text-right shrink-0">
                  {counts[t]} regulasi
                </span>
                <ArrowUpRight size={15} className="text-white/30 group-hover:text-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
