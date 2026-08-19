export default function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
}) {
  return (
    <div className="bg-paper-card border border-paper-line rounded-lg px-4 py-3.5 shadow-card">
      <p className="text-[11px] uppercase tracking-wide text-slate-muted">
        {label}
      </p>
      <p
        className={`font-display text-2xl mt-1 ${
          accent ? "text-seal" : "text-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
