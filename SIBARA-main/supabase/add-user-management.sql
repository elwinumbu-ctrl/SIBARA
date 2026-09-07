-- =========================================================
-- SIBARA - Tambahan: Manajemen Pengguna
-- Jalankan skrip ini di Supabase Dashboard -> SQL Editor -> New query -> Run
-- Jalankan SETELAH supabase/schema.sql. Aman dijalankan berulang kali.
--
-- Skrip ini menambahkan konsep "peran" (admin / auditor) sehingga admin
-- utama dapat membuat akun pengguna baru langsung dari menu "Pengguna"
-- di aplikasi, tanpa perlu lagi membuka Supabase Dashboard.
-- =========================================================

-- 1. Tabel profil: menyimpan nama lengkap & peran setiap akun
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nama_lengkap text,
  role text not null default 'auditor' check (role in ('admin', 'auditor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- 2. Setiap akun baru di auth.users otomatis mendapat baris profil
--    (peran default 'auditor'; admin utama membuat pengguna dengan peran
--    pilihan langsung lewat menu Pengguna di aplikasi)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nama_lengkap, role)
  values (
    new.id,
    nullif(new.raw_user_meta_data->>'nama_lengkap', ''),
    coalesce(new.raw_user_meta_data->>'role', 'auditor')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Isi baris profil untuk akun yang sudah ada sebelum skrip ini dijalankan
insert into public.profiles (id, role)
select id, 'auditor' from auth.users
on conflict (id) do nothing;

-- 4. Fungsi bantu untuk mengecek apakah pengguna yang sedang login adalah
--    admin, dipakai di kebijakan (policy) di bawah. security definer agar
--    pengecekan ini tidak terhalang RLS itu sendiri.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- 5. Row Level Security
alter table public.profiles enable row level security;

drop policy if exists "Pengguna dapat melihat profil sendiri" on public.profiles;
create policy "Pengguna dapat melihat profil sendiri"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "Admin dapat melihat semua profil" on public.profiles;
create policy "Admin dapat melihat semua profil"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

-- Catatan: pembuatan akun baru (insert ke auth.users & public.profiles)
-- dilakukan lewat API server aplikasi memakai service role key, sehingga
-- tidak memerlukan policy insert/update tambahan di sini.

-- =========================================================
-- PENTING - Tetapkan admin utama pertama secara manual (sekali saja):
-- Jalankan (ganti email sesuai akun yang sudah ada di auth.users):
--
--   update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'admin@contoh.go.id');
--
-- Setelah menjadi admin, akun tersebut akan melihat daftar pengguna dan
-- tombol "Tambah Pengguna" di menu Pengguna pada aplikasi.
-- =========================================================
