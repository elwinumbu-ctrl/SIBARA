-- =========================================================
-- SIBARA - Manajemen Pengguna (profiles + role admin)
-- Jalankan skrip ini di Supabase Dashboard -> SQL Editor -> New query -> Run
-- setelah supabase/schema.sql. Aman dijalankan berulang kali (idempotent).
--
-- Tabel ini MELENGKAPI auth.users bawaan Supabase Auth: auth.users
-- menyimpan email + password (dikelola Supabase), sedangkan
-- public.profiles menyimpan nama, role, dan status aktif setiap akun.
-- =========================================================

-- 1) Tabel profil pengguna
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nama text not null,
  role text not null default 'staff' check (role in ('admin', 'staff')),
  aktif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Data profil & role untuk setiap akun pengguna SIBARA (melengkapi auth.users).';

-- 2) Trigger: setiap kali ada user baru di auth.users, otomatis buat baris profiles.
-- Role default 'staff' -- admin pertama harus di-set manual lewat SQL Editor
-- (lihat catatan di bagian bawah file ini).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nama, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nama', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'staff')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3) updated_at otomatis
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- 4) Row Level Security
alter table public.profiles enable row level security;

-- Semua user yang login boleh melihat daftar profil (untuk keperluan UI,
-- misal menampilkan nama pembuat regulasi). Ubah/HAPUS policy ini kalau
-- data pengguna ingin lebih tertutup.
drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

-- Setiap user boleh mengubah namanya sendiri, tapi TIDAK boleh mengubah
-- role atau status aktif miliknya sendiri (mencegah user menaikkan diri
-- jadi admin). Perubahan role/aktif pengguna lain HARUS lewat Route
-- Handler server (pakai service_role key), bukan lewat client langsung.
drop policy if exists "profiles_update_self_nama_only" on public.profiles;
create policy "profiles_update_self_nama_only"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select role from public.profiles where id = auth.uid())
    and aktif = (select aktif from public.profiles where id = auth.uid())
  );

-- INSERT dan DELETE baris profiles tidak dibuka untuk client sama sekali;
-- INSERT ditangani trigger on_auth_user_created, dan create/update-role/
-- delete pengguna lain hanya lewat API route yang memakai service_role key
-- (lihat src/app/api/pengguna/route.ts).

-- =========================================================
-- CATATAN SETELAH MENJALANKAN SKRIP INI:
--
-- 1. Buat akun admin pertama lewat Supabase Dashboard -> Authentication ->
--    Users -> Add user (isi email + password), lalu jalankan query ini
--    untuk menjadikannya admin (ganti EMAIL_ADMIN):
--
--    update public.profiles set role = 'admin'
--    where id = (select id from auth.users where email = 'EMAIL_ADMIN');
--
-- 2. Set environment variable SUPABASE_SERVICE_ROLE_KEY di .env.local
--    (lihat Settings -> API di Supabase Dashboard). Key ini WAJIB rahasia,
--    hanya dipakai di server (Route Handler), jangan pernah dikirim ke
--    browser / commit ke git.
-- =========================================================
