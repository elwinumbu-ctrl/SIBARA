import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import AppShell from "@/components/AppShell";
import PageHero from "@/components/PageHero";
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
      dark
    >
      <PageHero
        icon={UsersIcon}
        eyebrow="Manajemen Akun"
        title="Pengguna SIBARA"
        description={
          isAdmin
            ? "Kelola profil akun Anda serta buat dan pantau akun auditor/admin lain."
            : "Profil akun Anda yang aktif saat ini di SIBARA."
        }
        actionHref={isAdmin ? "/pengguna/baru" : undefined}
        actionLabel={isAdmin ? "Tambah Pengguna" : undefined}
      />

      <div className="max-w-3xl space-y-4">
        <div className="surface-card-dark p-5 sm:p-6">
          <div className="flex items-center gap-4 mb-5">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 text-cyan font-display font-bold text-lg">
              {initials}
            </span>
            <div>
              <h2 className="font-display font-bold text-lg text-white">
                {myProfile?.nama_lengkap || user?.email?.split("@")[0] || "Administrator"}
              </h2>
              <p className="text-sm text-white/55">{user?.email}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1">Peran</p>
              <p className="text-sm text-white flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-cyan" />
                {isAdmin ? "Admin Utama" : "Auditor Inspektorat"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1">Wilayah Kerja</p>
              <p className="text-sm text-white">Inspektur Pembantu Wilayah IV</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1">Bergabung sejak</p>
              <p className="text-sm text-white">{joined}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1">Status Akun</p>
              <p className="text-sm text-status-berlaku font-medium">Aktif</p>
            </div>
          </div>
        </div>

        {isAdmin ? (
          <div className="surface-card-dark p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-cyan/10 text-cyan">
                  <UsersIcon size={16} />
                </span>
                <h3 className="font-display font-semibold text-sm text-white">
                  Daftar Pengguna ({daftarPengguna.length})
                </h3>
              </div>
              <Link
                href="/pengguna/baru"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent to-cyan text-white text-sm font-semibold px-3.5 py-2 shadow-glow hover:brightness-110 transition-all"
              >
                <Plus size={14} strokeWidth={2.4} />
                Tambah Pengguna
              </Link>
            </div>

            {listError && (
              <p className="text-sm text-status-dicabut bg-status-dicabut/10 border border-status-dicabut/20 rounded-lg px-3 py-2.5 mb-3">
                {listError}
              </p>
            )}

            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold text-white/40 uppercase tracking-wide border-b border-white/10">
                    <th className="px-1 py-2 font-semibold">Nama</th>
                    <th className="px-1 py-2 font-semibold">Email</th>
                    <th className="px-1 py-2 font-semibold">Peran</th>
                    <th className="px-1 py-2 font-semibold">Bergabung</th>
                  </tr>
                </thead>
                <tbody>
                  {daftarPengguna.map((p) => (
                    <tr key={p.id} className="border-b border-white/[0.06] last:border-0">
                      <td className="px-1 py-2.5 text-white font-medium whitespace-nowrap">
                        {p.nama_lengkap || "—"}
                      </td>
                      <td className="px-1 py-2.5 text-white/55 whitespace-nowrap">{p.email}</td>
                      <td className="px-1 py-2.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            p.role === "admin"
                              ? "bg-cyan/10 text-cyan"
                              : "bg-white/8 text-white/60"
                          }`}
                        >
                          {p.role === "admin" ? "Admin Utama" : "Auditor"}
                        </span>
                      </td>
                      <td className="px-1 py-2.5 text-white/55 whitespace-nowrap">
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
                      <td colSpan={4} className="px-1 py-6 text-center text-white/40">
                        Belum ada pengguna terdaftar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Link
              href="/pengguna/baru"
              className="sm:hidden mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-accent to-cyan text-white text-sm font-semibold px-3.5 py-2.5 shadow-glow transition-all"
            >
              <Plus size={14} strokeWidth={2.4} />
              Tambah Pengguna
            </Link>
          </div>
        ) : (
          <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
            <Info size={16} className="text-cyan shrink-0 mt-0.5" />
            <p className="text-xs text-white/55 leading-relaxed">
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
