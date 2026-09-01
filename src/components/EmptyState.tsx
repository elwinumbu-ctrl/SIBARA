import Link from "next/link";
import { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="text-center py-16 px-6 bg-white/70 backdrop-blur-sm border border-dashed border-border-strong rounded-2xl">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/8 text-accent mb-4">
        <Icon size={22} strokeWidth={1.7} />
      </div>
      <p className="font-display font-semibold text-lg text-ink mb-1">{title}</p>
      {description && (
        <p className="text-sm text-ink-subtle mb-4 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent text-white text-sm font-medium px-4 py-2 hover:bg-accent-600 transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
