type Tone = "ink" | "berlaku" | "ditinjau" | "dicabut";

const TONE_STYLE: Record<Tone, { text: string; bg: string; ring: string }> = {
  ink: { text: "text-ink", bg: "bg-ink/5", ring: "ring-ink/10" },
  berlaku: {
    text: "text-status-berlaku",
    bg: "bg-status-berlaku/10",
    ring: "ring-status-berlaku/15",
  },
  ditinjau: {
    text: "text-status-ditinjau",
    bg: "bg-status-ditinjau/10",
    ring: "ring-status-ditinjau/15",
  },
  dicabut: {
    text: "text-status-dicabut",
    bg: "bg-status-dicabut/10",
    ring: "ring-status-dicabut/15",
  },
};

const ICON: Record<Tone, React.ReactNode> = {
  ink: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="4.5" rx="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 8.5V18a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 13h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  berlaku: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m8.25 12.25 2.5 2.5 5-5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ditinjau: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  dicabut: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9.5 9.5 5 5m0-5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export default function StatCard({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: number | string;
  tone?: Tone;
}) {
  const s = TONE_STYLE[tone];

  return (
    <div className="group bg-paper-card border border-paper-line rounded-xl px-4 py-4 shadow-card hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-muted">
          {label}
        </p>
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ring-1 ${s.bg} ${s.text} ${s.ring}`}
        >
          {ICON[tone]}
        </span>
      </div>
      <p className="font-display text-3xl leading-none text-ink">{value}</p>
    </div>
  );
}
