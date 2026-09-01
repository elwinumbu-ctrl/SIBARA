import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import { Landmark, ScrollText, Building2, Layers, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

const KELOMPOK_UTAMA = ["Undang-Undang", "Peraturan Menteri", "Peraturan Daerah"] as const;

const JENIS_INFO = [
  {
    key: "Undang-Undang",
    label: "Undang-Undang",
    desc: "Dasar hukum tertinggi yang menjadi acuan utama pengelolaan dan pengawasan Dana BOSP.",
    icon: Landmark,
    text: "text-primary",
    bg: "bg-primary/8",
  },
  {
    key: "Peraturan Menteri",
    label: "Peraturan Menteri",
    desc: "Ketentuan teknis pelaksanaan dari kementerian terkait, seperti Kemendikbudristek dan Kemendagri.",
    icon: ScrollText,
    text: "text-accent",
    bg: "bg-accent/10",
  },
  {
    key: "Peraturan Daerah",
    label: "Peraturan Daerah",
    desc: "Ketentuan pelaksanaan yang ditetapkan di tingkat Kabupaten Sumba Barat.",
    icon: Building2,
    text: "text-perda",
    bg: "bg-perda-bg",
  },
] as const;

const LAINNYA_INFO = {
  key: "__lainnya__",
  label: "Regulasi Lainnya",
  desc: "Peraturan Pemerintah, Peraturan Presiden, Peraturan Bupati, Surat Edaran, Petunjuk Teknis, dan jenis lainnya.",
  icon: Layers,
  text: "text-ink-faint",
  bg: "bg-surface-subtle",
};

export default async function JenisPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase.from("regulasi").select("jenis");
  const rows = data ?? [];

  const counts: Record<string, number> = {};
  rows.forEach((r) => {
    counts[r.jenis] = (counts[r.jenis] ?? 0) + 1;
  });

  const totalUtama = KELOMPOK_UTAMA.reduce((sum, k) => sum + (counts[k] ?? 0), 0);
  const totalLainnya = rows.length - totalUtama;

  return (
    <AppShell
      active="jenis"
      email={user?.email}
      subtitle="Ringkasan regulasi berdasarkan jenis peraturan"
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {JENIS_INFO.map((j) => {
          const Icon = j.icon;
          return (
            <Link
              key={j.key}
              href={`/dashboard?jenis=${encodeURIComponent(j.key)}`}
              className="group bg-white border border-border rounded-2xl shadow-card hover:shadow-card-hover hover-lift p-5 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${j.bg} ${j.text}`}>
                  <Icon size={20} strokeWidth={1.9} />
                </span>
                <ArrowUpRight size={16} className="text-ink-faint group-hover:text-primary transition-colors" />
              </div>
              <p className="font-display text-3xl font-bold text-ink leading-none mb-1">
                {counts[j.key] ?? 0}
              </p>
              <h3 className="font-display font-semibold text-sm text-ink mb-1.5">{j.label}</h3>
              <p className="text-xs text-ink-faint leading-relaxed">{j.desc}</p>
            </Link>
          );
        })}
      </div>

      {/* Kelompok lainnya — agar setiap regulasi tetap terjangkau dari halaman ini */}
      <Link
        href={`/dashboard?jenis=${LAINNYA_INFO.key}`}
        className="group bg-white border border-border rounded-2xl shadow-card hover:shadow-card-hover hover-lift p-5 flex items-center gap-4"
      >
        <span className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${LAINNYA_INFO.bg} ${LAINNYA_INFO.text} shrink-0`}>
          <LAINNYA_INFO.icon size={20} strokeWidth={1.9} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-semibold text-sm text-ink group-hover:text-primary transition-colors">
            {LAINNYA_INFO.label}
          </h3>
          <p className="text-xs text-ink-faint mt-0.5 leading-relaxed">{LAINNYA_INFO.desc}</p>
        </div>
        <span className="font-display text-2xl font-bold text-ink shrink-0">
          {Math.max(0, totalLainnya)}
        </span>
        <ArrowUpRight size={16} className="text-ink-faint group-hover:text-primary transition-colors shrink-0" />
      </Link>
    </AppShell>
  );
}
