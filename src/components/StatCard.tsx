import { LucideIcon, FileStack, CheckCircle2, Clock, XCircle } from "lucide-react";

type Tone = "primary" | "berlaku" | "ditinjau" | "dicabut";

const TONE_ICON: Record<Tone, LucideIcon> = {
  primary: FileStack,
  berlaku: CheckCircle2,
  ditinjau: Clock,
  dicabut: XCircle,
};

// Accent per KPI, sesuai target visual: biru / emerald / amber / merah
const TONE_HEX: Record<Tone, string> = {
  primary: "#3B82F6",
  berlaku: "#22C55E",
  ditinjau: "#F59E0B",
  dicabut: "#EF4444",
};

export default function StatCard({
  label,
  value,
  caption,
  tone = "primary",
}: {
  label: string;
  value: number | string;
  caption?: string;
  tone?: Tone;
}) {
  const Icon = TONE_ICON[tone];
  const hex = TONE_HEX[tone];

  return (
    <div
      className="group relative overflow-hidden rounded-2xl px-5 py-5 border transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "rgba(255,255,255,0.06)",
        borderColor: "rgba(255,255,255,0.08)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <span
        className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-30 transition-opacity group-hover:opacity-45"
        style={{ backgroundColor: hex }}
      />
      <div className="relative flex items-start justify-between mb-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/55">
          {label}
        </p>
        <span
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
          style={{ backgroundColor: `${hex}22`, color: hex, border: `1px solid ${hex}33` }}
        >
          <Icon size={18} strokeWidth={2} />
        </span>
      </div>
      <p className="relative font-display text-[32px] sm:text-[34px] font-extrabold leading-none text-white tracking-tight">
        {value}
      </p>
      {caption && <p className="relative text-xs text-white/40 mt-2">{caption}</p>}

      {/* Decorative sparkline — purely visual accent, tidak merepresentasikan data time-series */}
      <svg
        className="relative mt-3 w-full h-6 opacity-70"
        viewBox="0 0 100 24"
        preserveAspectRatio="none"
      >
        <polyline
          points="0,18 14,15 28,17 42,10 56,12 70,6 84,9 100,3"
          fill="none"
          stroke={hex}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.55"
        />
      </svg>
    </div>
  );
}
