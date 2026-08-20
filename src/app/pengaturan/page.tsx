"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AppShell from "@/components/AppShell";
import { LogOut, Palette, ShieldCheck, Info } from "lucide-react";

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
    <AppShell active="pengaturan" email={email} subtitle="Preferensi aplikasi" showAddButton={false}>
      <div className="max-w-2xl space-y-4">
        <section className="bg-white border border-border rounded-2xl shadow-card p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary/8 text-primary">
              <Palette size={16} />
            </span>
            <h3 className="font-display font-semibold text-sm text-ink">Tampilan</h3>
          </div>
          <p className="text-sm text-ink-subtle leading-relaxed">
            SIBARA menggunakan tema navy profesional yang konsisten untuk
            memastikan keterbacaan dan kenyamanan penggunaan di lingkungan
            Inspektorat.
          </p>
        </section>

        <section className="bg-white border border-border rounded-2xl shadow-card p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary/8 text-primary">
              <ShieldCheck size={16} />
            </span>
            <h3 className="font-display font-semibold text-sm text-ink">Akun</h3>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-ink font-medium truncate">{email ?? "Administrator"}</p>
              <p className="text-xs text-ink-faint">Auditor Inspektorat Kabupaten Sumba Barat</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 shrink-0 rounded-lg border border-status-dicabut/30 text-status-dicabut hover:bg-status-dicabut-bg text-sm font-medium px-3.5 py-2 transition-colors"
            >
              <LogOut size={14} />
              Keluar
            </button>
          </div>
        </section>

        <section className="flex items-start gap-3 bg-primary/5 border border-primary/10 rounded-2xl p-4">
          <Info size={16} className="text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-ink-subtle leading-relaxed">
            SIBARA — Sistem Informasi Bank Regulasi Dana BOSP. Dikembangkan
            untuk mendukung pengawasan Inspektur Pembantu Wilayah IV,
            Inspektorat Kabupaten Sumba Barat.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
