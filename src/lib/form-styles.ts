// Shared form-field classes used across every form in the app (Tambah
// Regulasi, Edit Regulasi, Tambah Pengguna, ...). Kept in one place so the
// same input/select/textarea/label look is guaranteed everywhere, instead of
// three copies quietly drifting apart over time.
export const inputClass =
  "w-full rounded-lg border border-border bg-surface-muted px-3 py-2.5 text-sm text-ink focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/10 transition-shadow";

export const labelClass = "block text-xs font-semibold text-ink-subtle mb-1.5";
