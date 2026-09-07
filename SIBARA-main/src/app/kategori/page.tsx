import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import PageHero from "@/components/PageHero";
import { KATEGORI_REGULASI } from "@/lib/types";
import { Tags, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function KategoriPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase.from("regulasi").select("kategori");
  const counts: Record<string, number> = {};
  (data ?? []).forEach((r) => {
    counts[r.kategori] = (counts[r.kategori] ?? 0) + 1;
  });

  return (
    <AppShell
      active="kategori"
      email={user?.email}
      subtitle="Ringkasan regulasi berdasarkan kategori"
      dark
    >
      <PageHero
        icon={Tags}
        eyebrow="Master Data"
        title="Kategori Regulasi"
        description="Telusuri regulasi berdasarkan kategori pengelompokannya."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {KATEGORI_REGULASI.map((k) => (
          <Link
            key={k}
            href={`/regulasi?kategori=${encodeURIComponent(k)}`}
            className="group surface-card-dark hover:border-cyan/30 hover-lift p-5 flex items-start gap-4"
          >
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-cyan/10 text-cyan shrink-0">
              <Tags size={19} strokeWidth={1.9} />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-display font-semibold text-[15px] text-white group-hover:text-cyan transition-colors">
                {k}
              </h3>
              <p className="text-xs text-white/40 mt-1">
                {counts[k] ?? 0} regulasi terdaftar
              </p>
            </div>
            <ArrowUpRight size={16} className="text-white/30 group-hover:text-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
