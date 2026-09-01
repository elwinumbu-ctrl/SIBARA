"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-primary-800 px-4 py-12 text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/login-bg.png)" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-primary-800/85" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />
      <div
        className="pointer-events-none absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: "#155EEF" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-32 w-[420px] h-[420px] rounded-full opacity-15 blur-3xl"
        style={{ backgroundColor: "#0EA5E9" }}
      />

      <div className="relative flex items-center gap-2.5 mb-10">
        <ShieldCheck size={14} className="text-accent-light" />
        <span className="text-xs tracking-[0.2em] uppercase text-white/70">
          Pemerintah Kabupaten Sumba Barat
        </span>
      </div>

      <div className="relative w-full max-w-sm flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-2xl bg-white shadow-2xl flex items-center justify-center p-2.5 mb-5 ring-1 ring-white/10">
          <Image
            src="/logo-sumba-barat.png"
            alt="Lambang Kabupaten Sumba Barat"
            width={260}
            height={300}
            priority
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="font-display text-3xl font-bold leading-tight mb-2">SIBARA</h1>
        <p className="text-sm text-white/75">
          Sistem Informasi Bank Regulasi Dana BOSP
        </p>
        <p className="text-xs text-white/50 mb-8">
          Inspektorat Kabupaten Sumba Barat — Wilayah IV
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl ring-1 ring-white/40 p-6 sm:p-7 space-y-4 text-left"
        >
          <div>
            <label className="block text-xs font-semibold text-ink-subtle mb-1.5">
              Email
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-muted pl-9 pr-3 py-2.5 text-sm text-ink focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/10 transition-shadow"
                placeholder="nama@sumbabaratkab.go.id"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-subtle mb-1.5">
              Kata sandi
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-muted pl-9 pr-10 py-2.5 text-sm text-ink focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/10 transition-shadow"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-accent transition-colors"
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-status-dicabut bg-status-dicabut-bg rounded-lg px-3 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-accent text-white text-sm font-semibold py-2.5 hover:bg-accent-600 transition-colors disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Memproses...
              </>
            ) : (
              "Masuk"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-white/50 mt-6">
          Akses terbatas untuk auditor Inspektorat Kabupaten Sumba Barat.
          Hubungi admin sistem untuk pembuatan akun.
        </p>
      </div>

      <div className="relative flex items-center gap-3 text-xs text-white/40 mt-12">
        <span className="font-display italic">&ldquo;Pada Eweta Manda Elu&rdquo;</span>
        <span className="w-1 h-1 rounded-full bg-white/30" />
        <span>© {new Date().getFullYear()} Kabupaten Sumba Barat</span>
      </div>
    </div>
  );
}
