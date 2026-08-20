"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

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
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Hero / branding panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-ink-dark px-14 py-12 text-paper-card">
        {/* decorative texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #FBF9F4 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <div
          className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: "#B8862E" }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-16 w-[360px] h-[360px] rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: "#2F4470" }}
        />

        <div className="relative flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-seal" />
          <span className="text-xs tracking-[0.2em] uppercase text-paper-card/70">
            Pemerintah Kabupaten Sumba Barat
          </span>
        </div>

        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-paper-card/95 shadow-2xl flex items-center justify-center p-3 mb-8 ring-1 ring-white/10">
            <Image
              src="/logo-sumba-barat.png"
              alt="Lambang Kabupaten Sumba Barat"
              width={260}
              height={300}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="font-display text-4xl leading-tight mb-3">
            SIBARA
          </h1>
          <p className="text-paper-card/80 text-base leading-relaxed max-w-sm">
            Sistem Informasi Bank Regulasi Dana BOSP — arsip digital regulasi
            yang tertata, tertelusur, dan siap audit.
          </p>

          <div className="mt-10 h-px w-16 bg-seal/60" />

          <p className="mt-6 text-sm text-paper-card/60 max-w-sm">
            Inspektorat Kabupaten Sumba Barat — Wilayah IV
          </p>
        </div>

        <div className="relative flex items-center gap-3 text-xs text-paper-card/50">
          <span className="font-display italic">
            &ldquo;Pada Eweta Manda Elu&rdquo;
          </span>
          <span className="w-1 h-1 rounded-full bg-paper-card/30" />
          <span>© {new Date().getFullYear()} Kabupaten Sumba Barat</span>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-card ring-1 ring-paper-line p-2 mb-4 lg:hidden">
              <Image
                src="/logo-sumba-barat.png"
                alt="Lambang Kabupaten Sumba Barat"
                width={260}
                height={300}
                priority
                className="w-full h-full object-contain"
              />
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
            className="bg-paper-card border border-paper-line rounded-xl shadow-card p-6 sm:p-7 space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-slate-muted mb-1.5">
                Email
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-muted">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      d="M3 6.5a1.5 1.5 0 0 1 1.5-1.5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="m4 6.5 8 6.25L20 6.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-paper-line bg-white pl-9 pr-3 py-2.5 text-sm text-slate-text focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10 transition-shadow"
                  placeholder="nama@sumbabaratkab.go.id"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-muted mb-1.5">
                Kata sandi
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-muted">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect
                      x="4.5"
                      y="10.5"
                      width="15"
                      height="9.5"
                      rx="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.5 10.5V7.75a4.5 4.5 0 1 1 9 0v2.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-paper-line bg-white pl-9 pr-10 py-2.5 text-sm text-slate-text focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10 transition-shadow"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-muted hover:text-ink transition-colors"
                  aria-label={
                    showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                  }
                >
                  {showPassword ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M6.4 6.4C4.1 7.9 2.5 10 1.5 12c1.6 3.4 5.4 6.5 10.5 6.5 1.7 0 3.2-.35 4.55-.95M9.9 4.65A11.6 11.6 0 0 1 12 4.5c5.1 0 8.9 3.1 10.5 6.5-.5 1.05-1.2 2.15-2.1 3.15"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        d="M1.5 12S5.3 5.5 12 5.5 22.5 12 22.5 12 18.7 18.5 12 18.5 1.5 12 1.5 12Z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-status-dicabut bg-status-dicabut/10 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-ink text-paper-card text-sm font-medium py-2.5 hover:bg-ink-light transition-colors disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="3"
                      opacity="0.25"
                    />
                    <path
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-muted mt-6">
            Akses terbatas untuk auditor Inspektorat Kabupaten Sumba Barat.
            Hubungi admin sistem untuk pembuatan akun.
          </p>
        </div>
      </div>
    </div>
  );
}
