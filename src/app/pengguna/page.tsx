import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import { UserRound, ShieldCheck, Info } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PenggunaPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const initials = user?.email?.split("@")[0]?.slice(0, 2).toUpperCase() ?? "AD";
  const joined = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <AppShell active="pengguna" email={user?.email} subtitle="Profil akun pengguna aktif" showAddButton={false}>
      <div className="max-w-2xl">
        <div className="bg-white/95 backdrop-blur-sm border border-white/70 rounded-2xl shadow-panel p-5 sm:p-6 mb-4">
          <div className="flex items-center gap-4 mb-5">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary font-display font-bold text-lg">
              {initials}
            </span>
            <div>
              <h2 className="font-display font-bold text-lg text-ink">
                {user?.email?.split("@")[0] ?? "Administrator"}
              </h2>
              <p className="text-sm text-ink-subtle">{user?.email}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-1">Peran</p>
              <p className="text-sm text-ink flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-primary" /> Auditor Inspektorat
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-1">Wilayah Kerja</p>
              <p className="text-sm text-ink">Inspektur Pembantu Wilayah IV</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-1">Bergabung sejak</p>
              <p className="text-sm text-ink">{joined}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-1">Status Akun</p>
              <p className="text-sm text-status-berlaku font-medium">Aktif</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-primary/5 border border-primary/10 rounded-2xl p-4">
          <Info size={16} className="text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-ink-subtle leading-relaxed">
            Manajemen pengguna lain (tambah/nonaktifkan akun auditor) memerlukan
            akses administrator Supabase. Hubungi admin sistem untuk permintaan
            pembuatan akun baru.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
