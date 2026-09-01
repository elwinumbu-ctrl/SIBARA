import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import { CheckCircle2, Clock, XCircle, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_INFO = [
  {
    key: "berlaku",
    label: "Berlaku",
    desc: "Regulasi yang masih berlaku aktif dan menjadi acuan pengawasan Dana BOSP saat ini.",
    icon: CheckCircle2,
    text: "text-status-berlaku",
    bg: "bg-status-berlaku-bg",
  },
  {
    key: "ditinjau",
    label: "Ditinjau",
    desc: "Regulasi yang sedang dalam proses peninjauan ulang atau berpotensi diperbarui.",
    icon: Clock,
    text: "text-status-ditinjau",
    bg: "bg-status-ditinjau-bg",
  },
  {
    key: "dicabut",
    label: "Dicabut",
    desc: "Regulasi yang sudah tidak berlaku, disimpan sebagai arsip riwayat regulasi.",
    icon: XCircle,
    text: "text-status-dicabut",
    bg: "bg-status-dicabut-bg",
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
    >
      <div className="grid sm:grid-cols-3 gap-4">
        {STATUS_INFO.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.key}
              href={`/regulasi?status=${s.key}`}
              className="group bg-white border border-border rounded-2xl shadow-card hover:shadow-card-hover hover:border-accent/30 hover-lift p-5 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${s.bg} ${s.text}`}>
                  <Icon size={20} strokeWidth={1.9} />
                </span>
                <ArrowUpRight size={16} className="text-ink-faint group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <p className="font-display text-3xl font-bold text-ink leading-none mb-1">
                {counts[s.key] ?? 0}
              </p>
              <h3 className="font-display font-semibold text-sm text-ink mb-1.5">{s.label}</h3>
              <p className="text-xs text-ink-faint leading-relaxed">{s.desc}</p>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
