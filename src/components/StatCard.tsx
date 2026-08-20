import { LucideIcon, FileStack, CheckCircle2, Clock, XCircle } from "lucide-react";

type Tone = "primary" | "berlaku" | "ditinjau" | "dicabut";

const TONE_STYLE: Record<Tone, { text: string; bg: string }> = {
  primary: { text: "text-primary", bg: "bg-primary/8" },
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
    <div className="bg-white border border-border rounded-2xl px-5 py-4 shadow-card hover-lift hover:shadow-card-hover">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
          {label}
        </p>
        <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${s.bg} ${s.text}`}>
          <Icon size={18} strokeWidth={2} />
        </span>
      </div>
      <p className="font-display text-[28px] font-bold leading-none text-ink">{value}</p>
      {caption && <p className="text-xs text-ink-faint mt-1.5">{caption}</p>}
    </div>
  );
}
