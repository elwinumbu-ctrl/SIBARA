"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Email atau kata sandi salah. Silakan coba lagi.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ink text-paper-card font-display text-lg mb-4">
            SB
          </div>
          <h1 className="font-display text-2xl text-ink">SIBARA</h1>
          <p className="text-sm text-slate-muted mt-1">
            Sistem Informasi Bank Regulasi Dana BOSP
          </p>
          <p className="text-xs text-slate-muted">
            Inspektorat Kabupaten Sumba Barat — Wilayah IV
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-paper-card border border-paper-line rounded-lg shadow-card p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-slate-muted mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-paper-line bg-white px-3 py-2 text-sm text-slate-text focus:border-ink focus:outline-none"
              placeholder="nama@sumbabaratkab.go.id"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-muted mb-1">
              Kata sandi
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-paper-line bg-white px-3 py-2 text-sm text-slate-text focus:border-ink focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-status-dicabut bg-status-dicabut/10 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-ink text-paper-card text-sm font-medium py-2.5 hover:bg-ink-light transition-colors disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-muted mt-6">
          Akses terbatas untuk auditor Inspektorat Kabupaten Sumba Barat.
          Hubungi admin sistem untuk pembuatan akun.
        </p>
      </div>
    </div>
  );
}
