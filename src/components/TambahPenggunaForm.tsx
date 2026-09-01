"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "w-full rounded-lg border border-border bg-surface-muted px-3 py-2.5 text-sm text-ink focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/10 transition-shadow";
const labelClass = "block text-xs font-semibold text-ink-subtle mb-1.5";

function generatePassword() {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 12; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export default function TambahPenggunaForm() {
  const router = useRouter();

  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"auditor" | "admin">("auditor");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/pengguna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_lengkap: namaLengkap,
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat pengguna baru.");
      }

      router.push("/pengguna");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat membuat pengguna.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/95 backdrop-blur-sm border border-white/70 rounded-2xl shadow-panel p-5 sm:p-6 space-y-5"
    >
      <div>
        <label className={labelClass}>Nama lengkap *</label>
        <input
          required
          value={namaLengkap}
          onChange={(e) => setNamaLengkap(e.target.value)}
          placeholder="Contoh: Maria Goreti Bili"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Alamat email *</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@instansi.go.id"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Kata sandi awal *</label>
        <div className="flex gap-2">
          <input
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => setPassword(generatePassword())}
            className="shrink-0 rounded-lg border border-border bg-surface-muted px-3 text-xs font-semibold text-ink-subtle hover:bg-surface-subtle transition-colors"
          >
            Buat otomatis
          </button>
        </div>
        <p className="text-xs text-ink-faint mt-1.5">
          Sampaikan kata sandi ini kepada pengguna secara langsung; ia dapat
          menggantinya setelah masuk pertama kali.
        </p>
      </div>

      <div>
        <label className={labelClass}>Peran *</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "auditor" | "admin")}
          className={inputClass}
        >
          <option value="auditor">Auditor</option>
          <option value="admin">Admin Utama</option>
        </select>
        <p className="text-xs text-ink-faint mt-1.5">
          Admin utama dapat mengelola daftar pengguna; auditor hanya
          mengakses data regulasi.
        </p>
      </div>

      {error && (
        <p className="text-sm text-status-dicabut bg-status-dicabut-bg rounded-lg px-3 py-2.5">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-accent text-white text-sm font-semibold px-5 py-2.5 hover:bg-accent-600 transition-colors disabled:opacity-60 mt-4"
        >
          {loading ? "Menyimpan..." : "Buat Pengguna"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-ink-subtle hover:text-ink mt-4"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
