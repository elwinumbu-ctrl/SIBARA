"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AppShell from "@/components/AppShell";
import PageHero from "@/components/PageHero";
import { LogOut, Palette, ShieldCheck, Info, Settings, Building2, ChevronRight } from "lucide-react";

export default function PengaturanPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState<string | undefined>();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email));
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <AppShell active="pengaturan" email={email} subtitle="Preferensi aplikasi" showAddButton={false} dark>
      <PageHero
        icon={Settings}
        eyebrow="Preferensi"
        title="Pengaturan"
        description="Kelola tampilan aplikasi dan akun Anda di SIBARA."
      />
      <div className="max-w-2xl space-y-4">
        <section className="surface-card-dark p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-cyan/10 text-cyan">
              <Palette size={16} />
            </span>
            <h3 className="font-display font-semibold text-sm text-white">Tampilan</h3>
          </div>
          <p className="text-sm text-white/55 leading-relaxed">
            SIBARA menggunakan tema navy profesional yang konsisten untuk
            memastikan keterbacaan dan kenyamanan penggunaan di lingkungan
            Inspektorat.
          </p>
        </section>

        <Link
          href="/pengaturan/profil-inspektorat"
          className="group surface-card-dark p-5 sm:p-6 flex items-center gap-4 hover:border-cyan/30 hover-lift transition-colors"
        >
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-cyan/10 text-cyan shrink-0">
            <Building2 size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-semibold text-sm text-white group-hover:text-cyan transition-colors">
              Profil Inspektorat
            </h3>
            <p className="text-xs text-white/45 mt-0.5">
              Ubah identitas, kontak, visi & misi, serta data dan foto pejabat.
            </p>
          </div>
          <ChevronRight
            size={16}
            className="text-white/30 group-hover:text-cyan group-hover:translate-x-0.5 transition-all shrink-0"
          />
        </Link>

        <section className="surface-card-dark p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-cyan/10 text-cyan">
              <ShieldCheck size={16} />
            </span>
            <h3 className="font-display font-semibold text-sm text-white">Akun</h3>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-white font-medium truncate">{email ?? "Administrator"}</p>
              <p className="text-xs text-white/40">Auditor Inspektorat Kabupaten Sumba Barat</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 shrink-0 rounded-lg border border-status-dicabut/30 text-status-dicabut hover:bg-status-dicabut/10 text-sm font-medium px-3.5 py-2 transition-colors"
            >
              <LogOut size={14} />
              Keluar
            </button>
          </div>
        </section>

        <section className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
          <Info size={16} className="text-cyan shrink-0 mt-0.5" />
          <p className="text-xs text-white/55 leading-relaxed">
            SIBARA — Sistem Informasi Bank Regulasi Dana BOSP. Dikembangkan
            untuk mendukung pengawasan Inspektur Pembantu Wilayah IV,
            Inspektorat Kabupaten Sumba Barat.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
