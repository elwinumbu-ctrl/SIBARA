# SIBARA
**Sistem Informasi Bank Regulasi Dana BOSP Berbasis Digital**
Inspektorat Kabupaten Sumba Barat — Inspektur Pembantu Wilayah IV

Aplikasi web untuk menyimpan, mengelola, dan mencari regulasi Dana BOSP secara
terpusat: dikelompokkan berdasarkan jenis, tahun, instansi penerbit, kategori,
dan status keberlakuan, dilengkapi unggah dokumen dan tautan sumber resmi.

Dibangun dengan:
- **Next.js** (React) — aplikasi web
- **Supabase** — database, autentikasi, dan penyimpanan file
- **Vercel** — hosting/deployment
- **GitHub** — penyimpanan kode & pemicu deploy otomatis

Kode ini sudah lengkap dan siap dipakai. Tidak perlu menulis kode lagi —
ikuti langkah-langkah di bawah untuk menjalankannya di komputer Anda,
lalu menerbitkannya secara online lewat GitHub, Supabase, dan Vercel.

---

## 1. Siapkan proyek Supabase (database, login, penyimpanan file)

1. Buka [supabase.com](https://supabase.com) → **Start your project** → login/daftar.
2. Klik **New project**. Isi nama (misalnya `sibara`), buat kata sandi
   database, pilih region terdekat (misalnya Singapore), lalu **Create**.
3. Setelah proyek siap (±1-2 menit), buka menu **SQL Editor** di sidebar kiri.
4. Klik **New query**, buka file `supabase/schema.sql` dari folder proyek
   ini, salin seluruh isinya, tempel ke editor, lalu klik **Run**.
   Ini akan membuat tabel `regulasi`, aturan keamanan (RLS), dan folder
   penyimpanan file `regulasi-files` secara otomatis.
5. Buka menu **Project Settings → API**. Catat dua nilai berikut, akan
   dipakai di langkah 3 dan 5:
   - **Project URL**
   - **anon public key**
6. Buat akun auditor pertama Anda: buka **Authentication → Users → Add user**,
   isi email dan kata sandi. Auditor lain bisa ditambahkan dengan cara yang
   sama nantinya.

## 2. Jalankan aplikasi di komputer Anda (opsional, untuk uji coba)

Perlu [Node.js](https://nodejs.org) versi 18 atau lebih baru terpasang.

```bash
cd sibara
npm install
cp .env.example .env.local
```

Buka `.env.local`, isi dengan **Project URL** dan **anon public key** dari
langkah 1.5:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=isi-anon-public-key-di-sini
```

Jalankan:

```bash
npm run dev
```

Buka `http://localhost:3000` di browser, lalu masuk memakai akun auditor
yang dibuat di langkah 1.6.

## 3. Unggah kode ke GitHub

1. Buat repositori baru di [github.com/new](https://github.com/new), misalnya
   bernama `sibara`. Jangan centang "Add a README" (repo ini sudah punya).
2. Di folder proyek, jalankan:

```bash
cd sibara
git init
git add .
git commit -m "Inisialisasi aplikasi SIBARA"
git branch -M main
git remote add origin https://github.com/NAMA-AKUN-ANDA/sibara.git
git push -u origin main
```

File `.env.local` tidak akan ikut terunggah (sudah diatur di `.gitignore`),
jadi kredensial Supabase Anda tetap aman.

## 4. Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) → login memakai akun GitHub Anda.
2. Klik **Add New → Project**, pilih repositori `sibara` yang baru diunggah.
3. Pada bagian **Environment Variables**, tambahkan dua variabel yang sama
   seperti di `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Klik **Deploy**. Setelah selesai (±1-2 menit), Vercel akan memberikan
   URL publik seperti `https://sibara.vercel.app` — aplikasi sudah bisa
   diakses oleh seluruh auditor.

Setiap kali Anda melakukan `git push` ke GitHub setelahnya, Vercel akan
otomatis membangun ulang dan menerbitkan versi terbaru.

## 5. Menambahkan pengguna (auditor) baru

Buka Supabase → **Authentication → Users → Add user**, isi email dan kata
sandi auditor tersebut. Tidak perlu pendaftaran mandiri — akses memang
dibatasi hanya untuk auditor internal.

---

## Mengatasi error "Bucket not found" saat unggah dokumen

Error ini muncul ketika folder penyimpanan file (`regulasi-files`) belum
tersedia di proyek Supabase Anda — biasanya karena `supabase/schema.sql`
belum pernah dijalankan, atau bucket-nya sempat terhapus.

Cara memperbaiki:

1. Buka proyek Supabase Anda → menu **SQL Editor** di sidebar kiri.
2. Klik **New query**, buka file `supabase/fix-storage-bucket.sql` dari
   folder proyek ini, salin seluruh isinya, tempel ke editor, lalu klik
   **Run**.
3. Baris hasil di bagian bawah query akan menampilkan satu baris berisi
   `regulasi-files` jika berhasil.
4. Kembali ke aplikasi dan coba unggah dokumen lagi (tidak perlu deploy
   ulang, karena ini perubahan di sisi database/storage saja).

Jika masih gagal, buka Supabase → menu **Storage** di sidebar kiri dan
pastikan ada bucket bernama tepat `regulasi-files`. Jika belum ada, buat
manual lewat tombol **New bucket** (beri nama `regulasi-files`, aktifkan
**Public bucket**), lalu jalankan ulang langkah 1-2 di atas untuk
memastikan kebijakan aksesnya juga terpasang.

## Fitur ubah (edit) dan hapus regulasi

Setiap regulasi memiliki halaman detail (`/regulasi/[id]`) dengan dua
tombol di bagian bawah:

- **Ubah Data** — membuka form edit untuk semua kolom, termasuk opsi
  mengganti dokumen yang sudah diunggah (file lama otomatis dihapus dari
  penyimpanan setelah file baru berhasil tersimpan).
- **Hapus regulasi** — meminta konfirmasi, lalu menghapus data beserta
  dokumen terlampir (jika ada). Data tetap akan terhapus meskipun terjadi
  masalah pada penyimpanan file, agar tidak ada regulasi yang tersangkut.

## Struktur data regulasi

Setiap regulasi memiliki: judul, nomor regulasi, jenis (UU/PP/Permen/dsb.),
instansi penerbit, tahun terbit, kategori (Perencanaan/Penggunaan
Dana/Pelaporan/Pengawasan/dsb.), status keberlakuan (Berlaku/Ditinjau/
Dicabut), ringkasan, tautan sumber resmi, dan lampiran dokumen (PDF/Word).

Dashboard menyediakan pencarian kata kunci serta filter jenis, kategori,
tahun, dan status — sesuai kebutuhan yang diuraikan dalam rancangan
aktualisasi SIBARA.

## Struktur folder

```
sibara/
├── supabase/schema.sql             # skema database, jalankan di Supabase SQL Editor
├── supabase/fix-storage-bucket.sql # perbaikan cepat jika bucket dokumen hilang
├── src/
│   ├── app/
│   │   ├── login/             # halaman masuk
│   │   ├── dashboard/         # daftar, pencarian & filter regulasi
│   │   └── regulasi/
│   │       ├── baru/          # form tambah regulasi
│   │       └── [id]/          # detail, ubah, hapus regulasi
│   ├── components/            # komponen UI (kartu, navbar, badge status, dst.)
│   ├── lib/supabase/          # koneksi ke Supabase
│   └── middleware.ts          # proteksi halaman agar wajib login
└── .env.example
```
