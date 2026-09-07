-- =========================================================
-- SIBARA - Perbaikan cepat: "Bucket not found" saat unggah dokumen
-- Jalankan skrip ini di Supabase Dashboard -> SQL Editor -> New query -> Run
--
-- Gunakan skrip ini jika Anda sudah pernah menjalankan supabase/schema.sql
-- sebelumnya tetapi tetap mendapat error "Bucket not found" saat mengunggah
-- dokumen regulasi. Skrip ini aman dijalankan berulang kali.
-- =========================================================

-- 1. Buat bucket penyimpanan file regulasi jika belum ada
insert into storage.buckets (id, name, public)
values ('regulasi-files', 'regulasi-files', true)
on conflict (id) do nothing;

-- 2. Pastikan kebijakan akses (policy) untuk bucket tersebut ada
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

-- 3. Verifikasi: baris di bawah ini harus menampilkan 1 baris hasil
select id, name, public from storage.buckets where id = 'regulasi-files';
