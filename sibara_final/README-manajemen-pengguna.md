# Fitur Manajemen Pengguna — Panduan Pasang

File-file baru/berubah dalam paket ini:

```
supabase/schema-manajemen-pengguna.sql   <- jalankan di Supabase SQL Editor
src/lib/supabase/client.ts                <- Supabase client (browser)
src/lib/supabase/server.ts                <- Supabase client (server, sesi user)
src/lib/supabase/admin.ts                 <- Supabase client (service_role, admin only)
src/lib/auth-guard.ts                     <- getCurrentUser() & requireAdmin()
src/app/pengguna/page.tsx                 <- halaman /pengguna (server, admin only)
src/components/pengguna/PenggunaManager.tsx <- tabel + form tambah/edit/hapus
src/app/api/pengguna/route.ts             <- GET (list), POST (buat user)
src/app/api/pengguna/[id]/route.ts        <- PATCH (role/nama/status), DELETE
src/lib/nav.ts                            <- + menu "Manajemen Pengguna" (adminOnly)
src/components/Sidebar.tsx                <- + prop isAdmin untuk filter menu adminOnly
.env.local.example                        <- daftar env var yang dibutuhkan
```

## Langkah pasang

1. **Install dependency:**
   ```bash
   npm install @supabase/supabase-js @supabase/ssr server-only
   ```

2. **Jalankan SQL schema** (`supabase/schema-manajemen-pengguna.sql`) di
   Supabase Dashboard → SQL Editor. Jalankan setelah `supabase/schema.sql`
   yang sudah ada. Skrip ini aman dijalankan berulang kali.

3. **Isi environment variable** — salin `.env.local.example` ke
   `.env.local`, isi 3 nilainya dari Supabase Dashboard → Settings → API.

4. **Buat admin pertama** — buat 1 user lewat Dashboard → Authentication →
   Users → Add user, lalu jalankan query (ada juga di komentar akhir file
   SQL):
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'EMAIL_ADMIN_KAMU');
   ```

5. **Wiring ke layout kamu** — di tempat `<Sidebar />` dipanggil (biasanya
   `app/(dashboard)/layout.tsx` atau semacamnya), tambahkan prop `isAdmin`:
   ```tsx
   const currentUser = await getCurrentUser(); // dari src/lib/auth-guard.ts
   // ...
   <Sidebar
     active={active}
     collapsed={collapsed}
     onToggleCollapse={...}
     mobileOpen={mobileOpen}
     onCloseMobile={...}
     isGuest={isGuest}
     isAdmin={currentUser?.role === "admin"}
   />
   ```
   Tanpa ini, menu "Manajemen Pengguna" tetap ada tapi tersembunyi dari
   semua orang (defaultnya `isAdmin = false`).

## Kalau project ini sebenarnya pakai auth custom (bukan Supabase Auth)

Cukup ubah **`src/lib/auth-guard.ts`** saja — ganti isi `getCurrentUser()`
supaya membaca sesi dari sistem auth kamu, tapi tetap kembalikan objek
`CurrentUser { id, email, nama, role, aktif }`. Halaman, API route, dan
komponen tabel tidak perlu disentuh sama sekali karena semuanya hanya
bergantung pada bentuk `CurrentUser` tersebut, bukan Supabase secara
langsung (kecuali `src/app/api/pengguna/*` yang memakai Supabase Admin API
untuk create/delete akun — itu perlu diganti ke API sistem auth kamu kalau
memang tidak pakai Supabase Auth).

## Keamanan yang sudah dibangun

- Halaman `/pengguna` di-guard di server (`requireAdmin()`) — bukan cuma
  disembunyikan di UI, redirect kalau bukan admin.
- Semua endpoint `/api/pengguna/*` mengecek ulang role admin di server
  sebelum melakukan apa pun (tidak percaya pada state client).
- `service_role` key Supabase hanya dipakai di route handler server,
  dijaga dengan paket `server-only` supaya tidak bisa ter-bundle ke
  browser.
- Admin tidak bisa mengubah role/menonaktifkan/menghapus akunnya sendiri
  lewat fitur ini (mencegah kondisi "tidak ada admin aktif tersisa").
- Row Level Security aktif di tabel `profiles`: user biasa hanya bisa
  mengubah namanya sendiri, tidak bisa menaikkan role sendiri jadi admin.
