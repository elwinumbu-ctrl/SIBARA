-- =========================================================
-- SIBARA - Sistem Informasi Bank Regulasi Dana BOSP
-- Jalankan seluruh skrip ini di Supabase Dashboard
-- (SQL Editor -> New query -> paste -> Run)
-- =========================================================

-- 1. Tabel utama regulasi
create table if not exists public.regulasi (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  nomor_regulasi text,
  jenis text not null,              -- Undang-Undang, PP, Permendikbud, Perbup, dll
  instansi_penerbit text not null,  -- Kemendikbudristek, Kemendagri, Kemenkeu, dll
  tahun integer not null,
  kategori text not null,           -- Perencanaan, Penggunaan, Pelaporan, Pengawasan, dll
  status text not null default 'berlaku' check (status in ('berlaku', 'ditinjau', 'dicabut')),
  deskripsi text,
  link_resmi text,
  file_path text,                   -- path file di Supabase Storage (bucket: regulasi-files)
  file_nama text,
  dibuat_oleh uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists regulasi_tahun_idx on public.regulasi (tahun);
create index if not exists regulasi_jenis_idx on public.regulasi (jenis);
create index if not exists regulasi_kategori_idx on public.regulasi (kategori);
create index if not exists regulasi_status_idx on public.regulasi (status);
create index if not exists regulasi_search_idx on public.regulasi
  using gin (to_tsvector('simple', coalesce(judul,'') || ' ' || coalesce(nomor_regulasi,'')));

-- 2. Trigger untuk auto-update kolom updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_regulasi_updated_at on public.regulasi;
create trigger trg_regulasi_updated_at
  before update on public.regulasi
  for each row execute function public.set_updated_at();

-- 3. Row Level Security: hanya pengguna yang login (auditor internal) yang boleh akses
alter table public.regulasi enable row level security;

drop policy if exists "Pengguna login dapat melihat regulasi" on public.regulasi;
create policy "Pengguna login dapat melihat regulasi"
  on public.regulasi for select
  to authenticated
  using (true);

drop policy if exists "Pengguna login dapat menambah regulasi" on public.regulasi;
create policy "Pengguna login dapat menambah regulasi"
  on public.regulasi for insert
  to authenticated
  with check (true);

drop policy if exists "Pengguna login dapat memperbarui regulasi" on public.regulasi;
create policy "Pengguna login dapat memperbarui regulasi"
  on public.regulasi for update
  to authenticated
  using (true);

drop policy if exists "Pengguna login dapat menghapus regulasi" on public.regulasi;
create policy "Pengguna login dapat menghapus regulasi"
  on public.regulasi for delete
  to authenticated
  using (true);

-- 4. Storage bucket untuk file dokumen regulasi (PDF, dll)
insert into storage.buckets (id, name, public)
values ('regulasi-files', 'regulasi-files', true)
on conflict (id) do nothing;

drop policy if exists "Pengguna login dapat unggah file regulasi" on storage.objects;
create policy "Pengguna login dapat unggah file regulasi"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'regulasi-files');

drop policy if exists "Semua dapat membaca file regulasi" on storage.objects;
create policy "Semua dapat membaca file regulasi"
  on storage.objects for select
  to public
  using (bucket_id = 'regulasi-files');

drop policy if exists "Pengguna login dapat hapus file regulasi" on storage.objects;
create policy "Pengguna login dapat hapus file regulasi"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'regulasi-files');

-- =========================================================
-- Catatan:
-- - Buat akun auditor melalui Supabase Dashboard -> Authentication -> Users
--   -> Add user (isi email & password), atau aktifkan sign-up dari aplikasi.
-- - Kolom status: 'berlaku' (masih berlaku), 'ditinjau' (sedang ditinjau/akan
--   berubah), 'dicabut' (sudah tidak berlaku, disimpan untuk arsip).
-- =========================================================
