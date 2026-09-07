"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { inputClass, labelClass, inputClassDark, labelClassDark } from "@/lib/form-styles";


function generatePassword() {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 12; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export default function TambahPenggunaForm({ dark = false }: { dark?: boolean }) {
  const router = useRouter();

  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"auditor" | "admin">("auditor");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const field = dark ? inputClassDark : inputClass;
  const label = dark ? labelClassDark : labelClass;

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
      className={`p-5 sm:p-6 space-y-5 ${dark ? "surface-card-dark" : "surface-card"}`}
    >
      <div>
        <label className={label}>Nama lengkap *</label>
        <input
          required
          value={namaLengkap}
          onChange={(e) => setNamaLengkap(e.target.value)}
          placeholder="Contoh: Maria Goreti Bili"
          className={field}
        />
      </div>

      <div>
        <label className={label}>Alamat email *</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@instansi.go.id"
          className={field}
        />
      </div>

      <div>
        <label className={label}>Kata sandi awal *</label>
        <div className="flex gap-2">
          <input
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            className={field}
          />
          <button
            type="button"
            onClick={() => setPassword(generatePassword())}
            className={`shrink-0 rounded-lg border px-3 text-xs font-semibold transition-colors ${
              dark
                ? "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                : "border-border bg-surface-muted text-ink-subtle hover:bg-surface-subtle"
            }`}
          >
            Buat otomatis
          </button>
        </div>
        <p className={`text-xs mt-1.5 ${dark ? "text-white/40" : "text-ink-faint"}`}>
          Sampaikan kata sandi ini kepada pengguna secara langsung; ia dapat
          menggantinya setelah masuk pertama kali.
        </p>
      </div>

      <div>
        <label className={label}>Peran *</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "auditor" | "admin")}
          className={field}
        >
          <option value="auditor">Auditor</option>
          <option value="admin">Admin Utama</option>
        </select>
        <p className={`text-xs mt-1.5 ${dark ? "text-white/40" : "text-ink-faint"}`}>
          Admin utama dapat mengelola daftar pengguna; auditor hanya
          mengakses data regulasi.
        </p>
      </div>

      {error && (
        <p
          className={`text-sm rounded-lg px-3 py-2.5 ${
            dark ? "text-status-dicabut bg-status-dicabut/10 border border-status-dicabut/20" : "text-status-dicabut bg-status-dicabut-bg"
          }`}
        >
          {error}
        </p>
      )}

      <div className={`flex items-center gap-3 pt-2 border-t ${dark ? "border-white/10" : "border-border"}`}>
        <button
          type="submit"
          disabled={loading}
          className={`rounded-lg text-sm font-semibold px-5 py-2.5 transition-colors disabled:opacity-60 mt-4 ${
            dark
              ? "bg-gradient-to-r from-accent to-cyan text-white shadow-glow hover:brightness-110"
              : "bg-accent text-white hover:bg-accent-600"
          }`}
        >
          {loading ? "Menyimpan..." : "Buat Pengguna"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className={`text-sm mt-4 ${dark ? "text-white/50 hover:text-white" : "text-ink-subtle hover:text-ink"}`}
        >
          Batal
        </button>
      </div>
    </form>
  );
}
