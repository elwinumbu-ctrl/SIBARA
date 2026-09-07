import { requireAdmin } from "@/lib/auth-guard";
import PenggunaManager from "@/components/pengguna/PenggunaManager";

export const metadata = {
  title: "Manajemen Pengguna — SIBARA",
};

export default async function PenggunaPage() {
  // Redirect otomatis kalau belum login / bukan admin aktif.
  const currentUser = await requireAdmin();

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div>
        <h1 className="text-xl font-display font-bold text-primary">
          Manajemen Pengguna
        </h1>
        <p className="text-sm text-black/55 mt-0.5">
          Kelola akun admin/staf yang dapat mengakses SIBARA. Hanya admin
          yang dapat menambah, mengubah role, menonaktifkan, atau
          menghapus akun pengguna lain.
        </p>
      </div>

      <PenggunaManager currentUserId={currentUser.id} />
    </div>
  );
}
