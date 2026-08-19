/**
 * Mengubah pesan error teknis dari Supabase Storage menjadi pesan yang mudah
 * dipahami pengguna, lengkap dengan langkah perbaikannya.
 *
 * Kasus paling umum: bucket "regulasi-files" belum dibuat di proyek Supabase
 * (misalnya karena skrip supabase/schema.sql belum pernah dijalankan, atau
 * bucket sempat terhapus). Supabase akan mengembalikan pesan "Bucket not
 * found" untuk kasus ini.
 */
export function friendlyStorageError(err: unknown): string {
  const raw =
    (err as { message?: string })?.message ||
    (typeof err === "string" ? err : "") ||
    "Terjadi kesalahan saat mengunggah dokumen.";

  const lower = raw.toLowerCase();

  if (lower.includes("bucket not found")) {
    return (
      'Dokumen gagal diunggah karena folder penyimpanan "regulasi-files" ' +
      "belum tersedia di proyek Supabase. Data lain pada formulir ini " +
      "TIDAK disimpan sebelum masalah ini diperbaiki. Minta admin aplikasi " +
      "untuk membuka Supabase → SQL Editor, lalu menjalankan ulang isi " +
      "file supabase/schema.sql (atau supabase/fix-storage-bucket.sql) " +
      "untuk membuat bucket tersebut. Setelah itu coba unggah lagi."
    );
  }

  if (lower.includes("row-level security") || lower.includes("permission")) {
    return (
      "Dokumen gagal diunggah karena akun Anda tidak memiliki izin " +
      "menyimpan file (kebijakan keamanan Storage belum diatur dengan " +
      "benar). Minta admin aplikasi memeriksa kebijakan (policy) pada " +
      "storage.objects untuk bucket regulasi-files."
    );
  }

  if (lower.includes("payload too large") || lower.includes("exceeded")) {
    return "Dokumen gagal diunggah karena ukuran file terlalu besar. Gunakan file yang lebih kecil (disarankan di bawah 10 MB).";
  }

  if (lower.includes("failed to fetch") || lower.includes("network")) {
    return "Dokumen gagal diunggah karena koneksi internet terputus. Periksa koneksi Anda lalu coba lagi.";
  }

  return `Dokumen gagal diunggah: ${raw}`;
}
