-- =========================================================
-- SIBARA - Tambahan data: Regulasi Dana BOSP tahun 2021-2026
-- Jalankan skrip ini di Supabase Dashboard -> SQL Editor -> New query -> Run
-- setelah supabase/schema.sql. Aman dijalankan berulang kali (idempotent),
-- karena setiap INSERT dijaga dengan pengecekan nomor_regulasi + tahun.
--
-- Regulasi Dana BOSP tidak diterbitkan sebagai satu aturan tunggal yang
-- "berlaku 2021-2026", melainkan berupa rangkaian Permendikbud /
-- Permendikbudristek / Permendikdasmen yang terbit dan saling
-- menggantikan setiap tahun. Skrip ini menambahkan rangkaian regulasi
-- tersebut sehingga rentang tahun 2021-2026 tercakup di Bank Regulasi.
--
-- Kolom "tahun" mengikuti pola form Tambah Regulasi di aplikasi (Tahun
-- terbit), bukan rentang tahun berlaku. Rentang keberlakuan dijelaskan
-- pada kolom "deskripsi" masing-masing baris.
-- =========================================================

insert into public.regulasi
  (judul, nomor_regulasi, jenis, instansi_penerbit, tahun, kategori, status, deskripsi, link_resmi)
select * from (values
  (
    'Petunjuk Teknis Pengelolaan Dana Bantuan Operasional Sekolah (BOS) Reguler Tahun 2021',
    'Permendikbud No. 6 Tahun 2021',
    'Peraturan Menteri',
    'Kementerian Pendidikan dan Kebudayaan',
    2021,
    'Realisasi & Belanja',
    'dicabut',
    'Mengatur juknis pengelolaan Dana BOS Reguler tahun anggaran 2021, sebelum penyatuan istilah menjadi "Dana BOSP" pada tahun 2022. Berlaku untuk tahun anggaran 2021 dan digantikan oleh Permendikbudristek No. 63 Tahun 2022.',
    'https://jdih.kemendikbud.go.id/'
  ),
  (
    'Petunjuk Teknis Pengelolaan Dana Bantuan Operasional Satuan Pendidikan (BOSP)',
    'Permendikbudristek No. 63 Tahun 2022',
    'Peraturan Menteri',
    'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi',
    2022,
    'Realisasi & Belanja',
    'dicabut',
    'Regulasi dasar yang pertama kali menyatukan BOP PAUD, Dana BOS, dan BOP Kesetaraan ke dalam satu skema "Dana BOSP", berlaku sejak tahun anggaran 2022. Diubah dengan Permendikbudristek No. 63 Tahun 2023 dan pada akhirnya digantikan penuh oleh Permendikdasmen No. 8 Tahun 2025.',
    'https://jdih.kemendikbud.go.id/'
  ),
  (
    'Perubahan atas Permendikbudristek No. 63 Tahun 2022 tentang Petunjuk Teknis Pengelolaan Dana BOSP',
    'Permendikbudristek No. 63 Tahun 2023',
    'Peraturan Menteri',
    'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi',
    2023,
    'Realisasi & Belanja',
    'dicabut',
    'Merevisi sejumlah ketentuan Permendikbudristek No. 63 Tahun 2022, antara lain penambahan jenjang penerima (SDLB, SMPLB, SMALB) dan mekanisme penyaluran. Menjadi acuan juknis Dana BOSP untuk tahun anggaran 2023 dan 2024, sebelum digantikan Permendikdasmen No. 8 Tahun 2025.',
    'https://jdih.kemendikbud.go.id/'
  ),
  (
    'Petunjuk Teknis Pengelolaan Dana Bantuan Operasional Satuan Pendidikan Tahun 2025',
    'Permendikdasmen No. 8 Tahun 2025',
    'Peraturan Menteri',
    'Kementerian Pendidikan Dasar dan Menengah',
    2025,
    'Realisasi & Belanja',
    'dicabut',
    'Juknis Dana BOSP pertama yang diterbitkan Kementerian Pendidikan Dasar dan Menengah pasca pemisahan dari Kemendikbudristek, berlaku untuk tahun anggaran 2025. Dicabut dan digantikan oleh Permendikdasmen No. 8 Tahun 2026.',
    'https://peraturan.bpk.go.id/'
  ),
  (
    'Petunjuk Teknis Pengelolaan Dana Bantuan Operasional Satuan Pendidikan Tahun 2026',
    'Permendikdasmen No. 8 Tahun 2026',
    'Peraturan Menteri',
    'Kementerian Pendidikan Dasar dan Menengah',
    2026,
    'Realisasi & Belanja',
    'berlaku',
    'Juknis Dana BOSP terbaru, ditetapkan 5 Februari 2026 dan mulai berlaku 6 Februari 2026, mencabut Permendikdasmen No. 8 Tahun 2025. Mengatur pengelolaan Dana BOP PAUD, Dana BOS, dan Dana BOP Kesetaraan (reguler, kinerja, afirmasi) untuk tahun anggaran 2026, dengan penguatan tata kelola digital dan akuntabilitas.',
    'https://peraturan.bpk.go.id/Details/345734/permendikdasmen-no-8-tahun-2026'
  )
) as new_data(judul, nomor_regulasi, jenis, instansi_penerbit, tahun, kategori, status, deskripsi, link_resmi)
where not exists (
  select 1 from public.regulasi r
  where r.nomor_regulasi = new_data.nomor_regulasi
    and r.tahun = new_data.tahun
);

-- =========================================================
-- Catatan:
-- - Skrip ini hanya menambahkan data (tidak mengubah tabel/kolom).
-- - Setelah dijalankan, kelima regulasi ini akan langsung tampil di
--   halaman /regulasi dan /tahun sesuai tahun terbitnya masing-masing
--   (2021, 2022, 2023, 2025, 2026), karena keduanya membaca langsung
--   dari tabel public.regulasi.
-- - Nomor regulasi, judul, dan tanggal berlaku di atas disusun dari
--   sumber publik (JDIH Kemendikbud / peraturan.bpk.go.id). Disarankan
--   memeriksa ulang nomor Berita Negara & tautan resmi sebelum
--   dipublikasikan sebagai rujukan audit formal.
-- =========================================================
