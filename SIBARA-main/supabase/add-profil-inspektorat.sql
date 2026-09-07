-- =========================================================
-- SIBARA - Profil Inspektorat & Struktur Pejabat (dapat diedit)
-- Jalankan skrip ini di Supabase Dashboard -> SQL Editor -> Run
-- setelah supabase/schema.sql. Aman dijalankan berulang kali.
-- =========================================================

-- 1. Tabel profil_inspektorat: baris tunggal (id = 1) berisi identitas,
--    kontak, visi, misi, dan tugas pokok yang tampil di halaman
--    "Profil Inspektorat" dan dapat diedit lewat menu Pengaturan.
create table if not exists public.profil_inspektorat (
  id integer primary key default 1,
  selayang_pandang text,
  alamat text,
  telepon text,
  email text,
  visi text,
  misi text[] not null default '{}',
  tugas_pokok text[] not null default '{}',
  updated_at timestamptz not null default now(),
  constraint profil_inspektorat_singleton check (id = 1)
);

-- Pastikan selalu ada tepat satu baris konfigurasi
insert into public.profil_inspektorat (id)
values (1)
on conflict (id) do nothing;

drop trigger if exists trg_profil_inspektorat_updated_at on public.profil_inspektorat;
create trigger trg_profil_inspektorat_updated_at
  before update on public.profil_inspektorat
  for each row execute function public.set_updated_at();

alter table public.profil_inspektorat enable row level security;

drop policy if exists "Publik dapat melihat profil inspektorat" on public.profil_inspektorat;
create policy "Publik dapat melihat profil inspektorat"
  on public.profil_inspektorat for select
  to authenticated, anon
  using (true);

drop policy if exists "Pengguna login dapat memperbarui profil inspektorat" on public.profil_inspektorat;
create policy "Pengguna login dapat memperbarui profil inspektorat"
  on public.profil_inspektorat for update
  to authenticated
  using (true)
  with check (true);

-- 2. Tabel pejabat_struktur: daftar pejabat pada Struktur Organisasi,
--    masing-masing dapat memiliki foto (disimpan di bucket pejabat-photos).
create table if not exists public.pejabat_struktur (
  id uuid primary key default gen_random_uuid(),
  peran text not null,
  nama text,
  keterangan text,
  foto_path text,
  urutan integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pejabat_struktur_urutan_idx on public.pejabat_struktur (urutan);

drop trigger if exists trg_pejabat_struktur_updated_at on public.pejabat_struktur;
create trigger trg_pejabat_struktur_updated_at
  before update on public.pejabat_struktur
  for each row execute function public.set_updated_at();

alter table public.pejabat_struktur enable row level security;

drop policy if exists "Publik dapat melihat struktur pejabat" on public.pejabat_struktur;
create policy "Publik dapat melihat struktur pejabat"
  on public.pejabat_struktur for select
  to authenticated, anon
  using (true);

drop policy if exists "Pengguna login dapat menambah pejabat" on public.pejabat_struktur;
create policy "Pengguna login dapat menambah pejabat"
  on public.pejabat_struktur for insert
  to authenticated
  with check (true);

drop policy if exists "Pengguna login dapat memperbarui pejabat" on public.pejabat_struktur;
create policy "Pengguna login dapat memperbarui pejabat"
  on public.pejabat_struktur for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Pengguna login dapat menghapus pejabat" on public.pejabat_struktur;
create policy "Pengguna login dapat menghapus pejabat"
  on public.pejabat_struktur for delete
  to authenticated
  using (true);

-- Data awal (sesuai struktur bawaan tampilan lama) — hanya dimasukkan jika
-- tabel masih kosong, supaya skrip ini aman dijalankan ulang.
insert into public.pejabat_struktur (peran, nama, keterangan, urutan)
select * from (
  values
    ('Inspektur', null, 'Pimpinan tertinggi Inspektorat', 1),
    ('Sekretaris', null, 'Koordinasi administrasi & program', 2),
    ('Inspektur Pembantu Wilayah I', null, 'Wilayah kerja I', 3),
    ('Inspektur Pembantu Wilayah II', null, 'Wilayah kerja II', 4),
    ('Inspektur Pembantu Wilayah III', null, 'Wilayah kerja III', 5),
    ('Inspektur Pembantu Wilayah IV', null, 'Pengawasan Dana BOSP', 6)
) as seed(peran, nama, keterangan, urutan)
where not exists (select 1 from public.pejabat_struktur);

-- 3. Storage bucket untuk foto pejabat
insert into storage.buckets (id, name, public)
values ('pejabat-photos', 'pejabat-photos', true)
on conflict (id) do nothing;

drop policy if exists "Pengguna login dapat unggah foto pejabat" on storage.objects;
create policy "Pengguna login dapat unggah foto pejabat"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'pejabat-photos');

drop policy if exists "Semua dapat melihat foto pejabat" on storage.objects;
create policy "Semua dapat melihat foto pejabat"
  on storage.objects for select
  to public
  using (bucket_id = 'pejabat-photos');

drop policy if exists "Pengguna login dapat memperbarui foto pejabat" on storage.objects;
create policy "Pengguna login dapat memperbarui foto pejabat"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'pejabat-photos');

drop policy if exists "Pengguna login dapat hapus foto pejabat" on storage.objects;
create policy "Pengguna login dapat hapus foto pejabat"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'pejabat-photos');

-- =========================================================
-- Selesai. Setelah skrip ini dijalankan, menu
-- Pengaturan -> Edit Profil Inspektorat akan aktif dan
-- perubahan akan tersimpan permanen di database.
-- =========================================================
