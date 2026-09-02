import Link from "next/link";
import { LucideIcon, Plus } from "lucide-react";

/**
 * Cinematic deep-navy hero banner — the same visual language as the
 * dashboard's welcome banner, generalised so every other menu can open
 * with the same "premium government dashboard" feel instead of a plain
 * heading. Meant to sit right under <AppShell dark> at the top of a page.
 */
export default function PageHero({
  icon: Icon,
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon: LucideIcon;
  /** Small uppercase label above the title, e.g. "Master Data". */
  eyebrow?: string;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[20px] text-white mb-6 border"
      style={{
        borderColor: "rgba(255,255,255,0.10)",
        boxShadow: "0 20px 60px rgba(3,12,30,0.45)",
      }}
    >
      {/* Foto Kantor Inspektorat — bg-contain supaya seluruh foto (termasuk
          plang & papan nama) tetap terlihat utuh, tidak terpotong. */}
      <div
        className="pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/dashboard-bg.jpg)" }}
      />
      {/* Tint tipis supaya foto tetap terlihat, teks tetap kontras */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(120deg, rgba(10,35,72,0.72) 0%, rgba(18,58,114,0.55) 55%, rgba(14,44,90,0.72) 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 pattern-dots opacity-[0.06]" />
      <div className="pointer-events-none absolute -top-16 right-10 w-72 h-72 rounded-full opacity-25 blur-3xl bg-accent" />
      <div className="pointer-events-none absolute bottom-[-40%] left-[10%] w-64 h-64 rounded-full opacity-15 blur-3xl bg-cyan" />

      <div className="relative px-5 sm:px-8 py-6 sm:py-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-white/10 border border-white/15 text-cyan shrink-0">
              <Icon size={20} strokeWidth={1.9} />
            </span>
            <div className="min-w-0">
              {eyebrow && (
                <p className="text-[11px] tracking-[0.15em] uppercase text-white/55 mb-1">
                  {eyebrow}
                </p>
              )}
              <h2 className="font-display text-xl sm:text-2xl font-bold leading-tight truncate">
                {title}
              </h2>
              {description && (
                <p className="text-sm text-white/65 mt-1 max-w-xl">{description}</p>
              )}
            </div>
          </div>

          {actionHref && actionLabel && (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-accent to-cyan text-white text-sm font-semibold px-4 py-2.5 shadow-glow hover:brightness-110 hover:-translate-y-0.5 transition-all self-start shrink-0"
            >
              <Plus size={16} strokeWidth={2.4} />
              {actionLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
