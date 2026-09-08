-- =========================================================
-- SIBARA - Migrasi: penyesuaian nama Kategori Regulasi
-- Jalankan skrip ini di Supabase Dashboard -> SQL Editor -> New query -> Run
-- SETELAH meng-update aplikasi ke versi dengan nama kategori baru.
--
-- Nama kategori disimpan sebagai teks bebas di kolom regulasi.kategori,
-- sehingga regulasi lama yang sudah tersimpan tidak otomatis ikut
-- berubah namanya saat daftar KATEGORI_REGULASI di kode diganti. Skrip
-- ini menyamakan data lama dengan nama kategori yang baru, supaya
-- regulasi lama tetap muncul dengan benar di halaman Kategori,
-- Rekapitulasi, dan filter Regulasi.
--
-- Aman dijalankan berulang kali (idempotent) — baris yang kategorinya
-- sudah sesuai nama baru tidak akan terpengaruh.
-- =========================================================

update public.regulasi set kategori = 'Perencanaan & RKAS'   where kategori = 'Perencanaan';
update public.regulasi set kategori = 'Pengadaan (PBJ)'      where kategori = 'Pengadaan Barang/Jasa';
update public.regulasi set kategori = 'Realisasi & Belanja'  where kategori = 'Penggunaan Dana';
update public.regulasi set kategori = 'SPJ & Pelaporan'      where kategori = 'Pelaporan';
update public.regulasi set kategori = 'Audit & Pengawasan'   where kategori = 'Pengawasan';
update public.regulasi set kategori = 'Tata Kelola & SOP'    where kategori = 'Tata Kelola Sekolah';
-- 'Lainnya' tidak berubah, tidak perlu migrasi.
