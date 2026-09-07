"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ShieldCheck,
  UserCog,
  Loader2,
} from "lucide-react";

type Pengguna = {
  id: string;
  nama: string;
  email: string | null;
  role: "admin" | "staff";
  aktif: boolean;
  created_at: string;
};

type FormState = {
  mode: "tambah" | "edit";
  id?: string;
  nama: string;
  email: string;
  password: string;
  role: "admin" | "staff";
};

const EMPTY_FORM: FormState = {
  mode: "tambah",
  nama: "",
  email: "",
  password: "",
  role: "staff",
};

export default function PenggunaManager({
  currentUserId,
}: {
  currentUserId: string;
}) {
  const [pengguna, setPengguna] = useState<Pengguna[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadPengguna = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pengguna");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal memuat data.");
      setPengguna(data.pengguna);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPengguna();
  }, [loadPengguna]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSubmitting(true);
    setError(null);
    try {
      if (form.mode === "tambah") {
        const res = await fetch("/api/pengguna", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nama: form.nama,
            email: form.email,
            password: form.password,
            role: form.role,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Gagal menambah pengguna.");
      } else {
        const res = await fetch(`/api/pengguna/${form.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nama: form.nama, role: form.role }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Gagal mengubah pengguna.");
      }
      setForm(null);
      await loadPengguna();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleAktif(p: Pengguna) {
    setError(null);
    try {
      const res = await fetch(`/api/pengguna/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aktif: !p.aktif }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal mengubah status.");
      await loadPengguna();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    try {
      const res = await fetch(`/api/pengguna/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal menghapus pengguna.");
      setConfirmDeleteId(null);
      await loadPengguna();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => setForm({ ...EMPTY_FORM })}
          className="inline-flex items-center gap-2 rounded-lg bg-primary text-white text-sm font-semibold px-3.5 py-2 hover:bg-primary-800 transition-colors"
        >
          <Plus size={16} />
          Tambah Pengguna
        </button>
      </div>

      <div className="rounded-xl border border-black/10 overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead className="bg-black/[0.03] text-black/60 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Nama</th>
              <th className="text-left px-4 py-3 font-semibold">Email</th>
              <th className="text-left px-4 py-3 font-semibold">Role</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-right px-4 py-3 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-black/45">
                  <Loader2 className="animate-spin inline-block mr-2" size={16} />
                  Memuat data pengguna...
                </td>
              </tr>
            )}

            {!loading && pengguna.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-black/45">
                  Belum ada pengguna.
                </td>
              </tr>
            )}

            {!loading &&
              pengguna.map((p) => (
                <tr key={p.id} className="hover:bg-black/[0.015]">
                  <td className="px-4 py-3 font-medium text-black/80">
                    <span className="inline-flex items-center gap-1.5">
                      {p.role === "admin" && (
                        <ShieldCheck size={14} className="text-accent shrink-0" />
                      )}
                      {p.nama}
                      {p.id === currentUserId && (
                        <span className="text-[11px] text-black/40">(Anda)</span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-black/60">{p.email ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        p.role === "admin"
                          ? "bg-accent/10 text-accent"
                          : "bg-black/5 text-black/60"
                      }`}
                    >
                      {p.role === "admin" ? "Admin" : "Staf"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleAktif(p)}
                      disabled={p.id === currentUserId}
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium transition-opacity ${
                        p.aktif
                          ? "bg-green-100 text-green-700"
                          : "bg-black/10 text-black/50"
                      } ${
                        p.id === currentUserId
                          ? "cursor-not-allowed opacity-60"
                          : "hover:opacity-80"
                      }`}
                      title={
                        p.id === currentUserId
                          ? "Tidak bisa mengubah status sendiri"
                          : p.aktif
                          ? "Klik untuk nonaktifkan"
                          : "Klik untuk aktifkan"
                      }
                    >
                      {p.aktif ? "Aktif" : "Nonaktif"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() =>
                          setForm({
                            mode: "edit",
                            id: p.id,
                            nama: p.nama,
                            email: p.email ?? "",
                            password: "",
                            role: p.role,
                          })
                        }
                        className="p-1.5 rounded-lg text-black/50 hover:text-primary hover:bg-black/5"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(p.id)}
                        disabled={p.id === currentUserId}
                        className="p-1.5 rounded-lg text-black/50 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Hapus"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal tambah/edit */}
      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-primary flex items-center gap-2">
                <UserCog size={18} />
                {form.mode === "tambah" ? "Tambah Pengguna" : "Edit Pengguna"}
              </h2>
              <button
                onClick={() => setForm(null)}
                className="text-black/40 hover:text-black/70"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-black/60 mb-1">
                  Nama
                </label>
                <input
                  required
                  value={form.nama}
                  onChange={(e) =>
                    setForm((f) => (f ? { ...f, nama: e.target.value } : f))
                  }
                  className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-black/60 mb-1">
                  Email
                </label>
                <input
                  required
                  type="email"
                  disabled={form.mode === "edit"}
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => (f ? { ...f, email: e.target.value } : f))
                  }
                  className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm disabled:bg-black/5 disabled:text-black/40 focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
                {form.mode === "edit" && (
                  <p className="text-[11px] text-black/40 mt-1">
                    Email tidak bisa diubah dari sini.
                  </p>
                )}
              </div>

              {form.mode === "tambah" && (
                <div>
                  <label className="block text-xs font-medium text-black/60 mb-1">
                    Password
                  </label>
                  <input
                    required
                    type="password"
                    minLength={8}
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) =>
                        f ? { ...f, password: e.target.value } : f
                      )
                    }
                    className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                  <p className="text-[11px] text-black/40 mt-1">
                    Minimal 8 karakter.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-black/60 mb-1">
                  Role
                </label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm((f) =>
                      f
                        ? { ...f, role: e.target.value as "admin" | "staff" }
                        : f
                    )
                  }
                  className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  <option value="staff">Staf</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForm(null)}
                  className="rounded-lg px-3.5 py-2 text-sm text-black/60 hover:bg-black/5"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary text-white text-sm font-semibold px-3.5 py-2 hover:bg-primary-800 disabled:opacity-60"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Konfirmasi hapus */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl space-y-3">
            <h2 className="font-display font-bold text-primary">
              Hapus pengguna ini?
            </h2>
            <p className="text-sm text-black/60">
              Akun ini tidak akan bisa login lagi ke SIBARA setelah dihapus.
              Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="rounded-lg px-3.5 py-2 text-sm text-black/60 hover:bg-black/5"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="rounded-lg bg-red-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
