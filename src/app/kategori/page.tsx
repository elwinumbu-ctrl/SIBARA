import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
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
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {KATEGORI_REGULASI.map((k) => (
          <Link
            key={k}
            href={`/regulasi?kategori=${encodeURIComponent(k)}`}
            className="group surface-card hover:shadow-card-hover hover:border-accent/30 hover-lift p-5 flex items-start gap-4"
          >
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-accent/8 text-accent shrink-0">
              <Tags size={19} strokeWidth={1.9} />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-display font-semibold text-[15px] text-ink group-hover:text-accent transition-colors">
                {k}
              </h3>
              <p className="text-xs text-ink-faint mt-1">
                {counts[k] ?? 0} regulasi terdaftar
              </p>
            </div>
            <ArrowUpRight size={16} className="text-ink-faint group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
