import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import PageHero from "@/components/PageHero";
import { CheckCircle2, Clock, XCircle, ArrowUpRight, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_INFO = [
  {
    key: "berlaku",
    label: "Berlaku",
    desc: "Regulasi yang masih berlaku aktif dan menjadi acuan pengawasan Dana BOSP saat ini.",
    icon: CheckCircle2,
    hex: "#22C55E",
  },
  {
    key: "ditinjau",
    label: "Ditinjau",
    desc: "Regulasi yang sedang dalam proses peninjauan ulang atau berpotensi diperbarui.",
    icon: Clock,
    hex: "#F59E0B",
  },
  {
    key: "dicabut",
    label: "Dicabut",
    desc: "Regulasi yang sudah tidak berlaku, disimpan sebagai arsip riwayat regulasi.",
    icon: XCircle,
    hex: "#EF4444",
  },
] as const;

export default async function StatusPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase.from("regulasi").select("status");
  const counts: Record<string, number> = { berlaku: 0, ditinjau: 0, dicabut: 0 };
  (data ?? []).forEach((r) => {
    counts[r.status] = (counts[r.status] ?? 0) + 1;
  });

  return (
    <AppShell
      active="status"
      email={user?.email}
      subtitle="Ringkasan regulasi berdasarkan status keberlakuan"
      dark
    >
      <PageHero
        icon={Activity}
        eyebrow="Master Data"
        title="Status Keberlakuan"
        description="Telusuri regulasi berdasarkan status keberlakuannya."
      />
      <div className="grid sm:grid-cols-3 gap-4">
        {STATUS_INFO.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.key}
              href={`/regulasi?status=${s.key}`}
              className="group surface-card-dark hover:border-cyan/30 hover-lift p-5 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="inline-flex items-center justify-center w-11 h-11 rounded-xl"
                  style={{ backgroundColor: `${s.hex}22`, color: s.hex, border: `1px solid ${s.hex}33` }}
                >
                  <Icon size={20} strokeWidth={1.9} />
                </span>
                <ArrowUpRight size={16} className="text-white/30 group-hover:text-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <p className="font-display text-3xl font-bold text-white leading-none mb-1">
                {counts[s.key] ?? 0}
              </p>
              <h3 className="font-display font-semibold text-sm text-white mb-1.5">{s.label}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
