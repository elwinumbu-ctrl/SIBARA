import { LucideIcon, FileStack, CheckCircle2, Clock, XCircle } from "lucide-react";

type Tone = "primary" | "berlaku" | "ditinjau" | "dicabut";

const TONE_STYLE: Record<Tone, { text: string; bg: string }> = {
  primary: { text: "text-accent", bg: "bg-accent/8" },
  berlaku: { text: "text-status-berlaku", bg: "bg-status-berlaku-bg" },
  ditinjau: { text: "text-status-ditinjau", bg: "bg-status-ditinjau-bg" },
  dicabut: { text: "text-status-dicabut", bg: "bg-status-dicabut-bg" },
};

const TONE_ICON: Record<Tone, LucideIcon> = {
  primary: FileStack,
  berlaku: CheckCircle2,
  ditinjau: Clock,
  dicabut: XCircle,
};

const TONE_GLOW: Record<Tone, string> = {
  primary: "bg-accent/15",
  berlaku: "bg-status-berlaku/15",
  ditinjau: "bg-status-ditinjau/15",
  dicabut: "bg-status-dicabut/15",
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
  const s = TONE_STYLE[tone];
  const Icon = TONE_ICON[tone];

  return (
    <div className="relative overflow-hidden bg-white/95 backdrop-blur-sm border border-white/70 rounded-2xl px-5 py-5 shadow-panel hover-lift hover:shadow-card-hover hover:border-accent/20">
      <span
        className={`pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl ${TONE_GLOW[tone]}`}
      />
      <div className="relative flex items-start justify-between mb-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
          {label}
        </p>
        <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${s.bg} ${s.text}`}>
          <Icon size={18} strokeWidth={2} />
        </span>
      </div>
      <p className="font-display text-[32px] sm:text-[34px] font-extrabold leading-none text-ink tracking-tight">
        {value}
      </p>
      {caption && <p className="text-xs text-ink-faint mt-2">{caption}</p>}
    </div>
  );
}
