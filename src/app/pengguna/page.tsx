import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import AppShell from "@/components/AppShell";
import Link from "next/link";
import {
  ShieldCheck,
  Info,
  Plus,
  Users as UsersIcon,
} from "lucide-react";
import type { PenggunaListItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PenggunaPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: myProfile } = user
    ? await supabase
        .from("profiles")
        .select("nama_lengkap, role")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };

  const isAdmin = myProfile?.role === "admin";

  const initials =
    (myProfile?.nama_lengkap || user?.email)
      ?.split(/[@\s]/)[0]
      ?.slice(0, 2)
      .toUpperCase() ?? "AD";
  const joined = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  // Admin utama: muat daftar seluruh pengguna langsung lewat service role,
  // supaya halaman ini tidak perlu memanggil API-nya sendiri.
  let daftarPengguna: PenggunaListItem[] = [];
  let listError: string | null = null;

  if (isAdmin) {
    try {
      const admin = createAdminClient();
      const [{ data: authUsers, error: authErr }, { data: profiles, error: profileErr }] =
        await Promise.all([
          admin.auth.admin.listUsers({ perPage: 1000 }),
          supabase.from("profiles").select("id, nama_lengkap, role, created_at"),
        ]);
      if (authErr) throw authErr;
      if (profileErr) throw profileErr;

      const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
      daftarPengguna = (authUsers?.users ?? [])
        .map((u) => {
          const p = profileMap.get(u.id);
          return {
            id: u.id,
            email: u.email ?? null,
            nama_lengkap: p?.nama_lengkap ?? null,
            role: (p?.role as "admin" | "auditor") ?? "auditor",
            created_at: p?.created_at ?? u.created_at,
          };
        })
        .sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    } catch (err: any) {
      listError = err?.message || "Gagal memuat daftar pengguna.";
    }
  }

  return (
    <AppShell
      active="pengguna"
      email={user?.email}
      subtitle={isAdmin ? "Profil akun & manajemen pengguna" : "Profil akun pengguna aktif"}
      showAddButton={isAdmin}
      addHref="/pengguna/baru"
      addLabel="Tambah Pengguna"
    >
      <div className="max-w-3xl space-y-4">
        <div className="bg-white/95 backdrop-blur-sm border border-white/70 rounded-2xl shadow-panel p-5 sm:p-6">
          <div className="flex items-center gap-4 mb-5">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary font-display font-bold text-lg">
              {initials}
            </span>
            <div>
              <h2 className="font-display font-bold text-lg text-ink">
                {myProfile?.nama_lengkap || user?.email?.split("@")[0] || "Administrator"}
              </h2>
              <p className="text-sm text-ink-subtle">{user?.email}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-1">Peran</p>
              <p className="text-sm text-ink flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-primary" />
                {isAdmin ? "Admin Utama" : "Auditor Inspektorat"}
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

        {isAdmin ? (
          <div className="bg-white/95 backdrop-blur-sm border border-white/70 rounded-2xl shadow-panel p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary/8 text-primary">
                  <UsersIcon size={16} />
                </span>
                <h3 className="font-display font-semibold text-sm text-ink">
                  Daftar Pengguna ({daftarPengguna.length})
                </h3>
              </div>
              <Link
                href="/pengguna/baru"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-accent hover:bg-accent-600 text-white text-sm font-semibold px-3.5 py-2 transition-colors"
              >
                <Plus size={14} strokeWidth={2.4} />
                Tambah Pengguna
              </Link>
            </div>

            {listError && (
              <p className="text-sm text-status-dicabut bg-status-dicabut-bg rounded-lg px-3 py-2.5 mb-3">
                {listError}
              </p>
            )}

            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold text-ink-faint uppercase tracking-wide border-b border-border">
                    <th className="px-1 py-2 font-semibold">Nama</th>
                    <th className="px-1 py-2 font-semibold">Email</th>
                    <th className="px-1 py-2 font-semibold">Peran</th>
                    <th className="px-1 py-2 font-semibold">Bergabung</th>
                  </tr>
                </thead>
                <tbody>
                  {daftarPengguna.map((p) => (
                    <tr key={p.id} className="border-b border-border/60 last:border-0">
                      <td className="px-1 py-2.5 text-ink font-medium whitespace-nowrap">
                        {p.nama_lengkap || "—"}
                      </td>
                      <td className="px-1 py-2.5 text-ink-subtle whitespace-nowrap">{p.email}</td>
                      <td className="px-1 py-2.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            p.role === "admin"
                              ? "bg-primary/10 text-primary"
                              : "bg-surface-subtle text-ink-subtle"
                          }`}
                        >
                          {p.role === "admin" ? "Admin Utama" : "Auditor"}
                        </span>
                      </td>
                      <td className="px-1 py-2.5 text-ink-subtle whitespace-nowrap">
                        {new Date(p.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                  {daftarPengguna.length === 0 && !listError && (
                    <tr>
                      <td colSpan={4} className="px-1 py-6 text-center text-ink-faint">
                        Belum ada pengguna terdaftar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Link
              href="/pengguna/baru"
              className="sm:hidden mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-accent hover:bg-accent-600 text-white text-sm font-semibold px-3.5 py-2.5 transition-colors"
            >
              <Plus size={14} strokeWidth={2.4} />
              Tambah Pengguna
            </Link>
          </div>
        ) : (
          <div className="flex items-start gap-3 bg-primary/5 border border-primary/10 rounded-2xl p-4">
            <Info size={16} className="text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-ink-subtle leading-relaxed">
              Manajemen pengguna lain (tambah/nonaktifkan akun auditor) hanya
              dapat dilakukan oleh admin utama. Hubungi admin aplikasi untuk
              permintaan pembuatan akun baru.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
