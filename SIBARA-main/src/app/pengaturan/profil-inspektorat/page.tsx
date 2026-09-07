"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import AppShell from "@/components/AppShell";
import PageHero from "@/components/PageHero";
import ProfilInspektoratForm from "@/components/ProfilInspektoratForm";
import PejabatManager from "@/components/PejabatManager";
import { ArrowLeft, Building2 } from "lucide-react";

export default function EditProfilInspektoratPage() {
  const supabase = createClient();
  const [email, setEmail] = useState<string | undefined>();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email));
  }, []);

  return (
    <AppShell
      active="pengaturan"
      email={email}
      subtitle="Edit profil inspektorat"
      showAddButton={false}
      dark
    >
      <PageHero
        icon={Building2}
        eyebrow="Pengaturan"
        title="Edit Profil Inspektorat"
        description="Perubahan di sini akan langsung tampil di halaman Profil Inspektorat untuk semua pengguna."
      />

      <Link
        href="/pengaturan"
        className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-4"
      >
        <ArrowLeft size={14} /> Kembali ke Pengaturan
      </Link>

      <div className="max-w-2xl space-y-6">
        <ProfilInspektoratForm />

        <div className="surface-card-dark p-5 sm:p-6">
          <PejabatManager />
        </div>
      </div>
    </AppShell>
  );
}
