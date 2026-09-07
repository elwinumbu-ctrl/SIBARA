import Link from "next/link";
import { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  /** Use inside a dark/navy panel (e.g. the dashboard hero cards) so the
   * empty state reads as part of that surface instead of a stray light box. */
  dark = false,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`text-center py-16 px-6 rounded-2xl border border-dashed ${
        dark ? "bg-white/[0.03] border-white/15" : "bg-white/70 backdrop-blur-sm border-border-strong"
      }`}
    >
      <div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
          dark ? "bg-white/10 text-cyan" : "bg-accent/8 text-accent"
        }`}
      >
        <Icon size={22} strokeWidth={1.7} />
      </div>
      <p className={`font-display font-semibold text-lg mb-1 ${dark ? "text-white" : "text-ink"}`}>
        {title}
      </p>
      {description && (
        <p className={`text-sm mb-4 max-w-sm mx-auto leading-relaxed ${dark ? "text-white/50" : "text-ink-subtle"}`}>
          {description}
        </p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className={`inline-flex items-center gap-1.5 rounded-lg text-sm font-medium px-4 py-2 transition-colors ${
            dark
              ? "bg-gradient-to-r from-accent to-cyan text-white shadow-glow hover:brightness-110"
              : "bg-accent text-white hover:bg-accent-600"
          }`}
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
