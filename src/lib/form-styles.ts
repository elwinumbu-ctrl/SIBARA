// Shared form-field classes used across every form in the app (Tambah
// Regulasi, Edit Regulasi, Tambah Pengguna, ...). Kept in one place so the
// same input/select/textarea/label look is guaranteed everywhere, instead of
// three copies quietly drifting apart over time.
export const inputClass =
  "w-full rounded-lg border border-border bg-surface-muted px-3 py-2.5 text-sm text-ink focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/10 transition-shadow";

export const labelClass = "block text-xs font-semibold text-ink-subtle mb-1.5";

// Dark counterparts, for forms living on the cinematic navy canvas
// (dark AppShell pages) so inputs read as part of that surface instead of
// a stray white box.
export const inputClassDark =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-cyan/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan/20 transition-shadow [&>option]:text-ink";

export const labelClassDark = "block text-xs font-semibold text-white/60 mb-1.5";
