-- =========================================================
-- SIBARA - Tambahan: Akses Pengunjung (guest / read-only)
-- Jalankan skrip ini di Supabase Dashboard -> SQL Editor -> New query -> Run
-- setelah supabase/schema.sql, supabase/add-user-management.sql, dan
-- supabase/add-profil-inspektorat.sql. Aman dijalankan berulang kali.
--
-- Skrip ini mengaktifkan tombol "Masuk sebagai Pengunjung" di halaman
-- login. Pengunjung masuk memakai sesi anonim Supabase (tanpa akun/kata
-- sandi), sehingga tetap dianggap "authenticated" oleh Supabase tapi
-- ditandai is_anonymous = true. Kebijakan di bawah memastikan sesi
-- semacam ini HANYA bisa membaca data, tidak bisa menambah/mengubah/
-- menghapus apa pun.
--
-- PENTING: fitur ini juga harus diaktifkan secara manual di:
-- Supabase Dashboard -> Authentication -> Sign In / Providers ->
-- Anonymous Sign-Ins -> Enable.
-- =========================================================

-- 1. Fungsi bantu: true jika sesi yang sedang login adalah sesi pengunjung
--    (anonymous sign-in), false untuk pengguna biasa (auditor/admin).
create or replace function public.is_guest()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false);
$$;

-- 2. Jangan buat baris public.profiles untuk sesi pengunjung anonim,
--    supaya tidak muncul di menu "Pengguna" milik admin.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  if coalesce(new.is_anonymous, false) then
    return new;
  end if;

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

-- 3. regulasi: pengunjung boleh SELECT (via policy "authenticated" yang
--    sudah ada), tapi INSERT/UPDATE/DELETE ditutup untuk sesi anonim.
drop policy if exists "Pengguna login dapat menambah regulasi" on public.regulasi;
create policy "Pengguna login dapat menambah regulasi"
  on public.regulasi for insert
  to authenticated
  with check (not public.is_guest());

drop policy if exists "Pengguna login dapat memperbarui regulasi" on public.regulasi;
create policy "Pengguna login dapat memperbarui regulasi"
  on public.regulasi for update
  to authenticated
  using (not public.is_guest())
  with check (not public.is_guest());

drop policy if exists "Pengguna login dapat menghapus regulasi" on public.regulasi;
create policy "Pengguna login dapat menghapus regulasi"
  on public.regulasi for delete
  to authenticated
  using (not public.is_guest());

-- 4. pejabat_struktur: sama seperti regulasi, hanya SELECT untuk pengunjung.
drop policy if exists "Pengguna login dapat menambah pejabat" on public.pejabat_struktur;
create policy "Pengguna login dapat menambah pejabat"
  on public.pejabat_struktur for insert
  to authenticated
  with check (not public.is_guest());

drop policy if exists "Pengguna login dapat memperbarui pejabat" on public.pejabat_struktur;
create policy "Pengguna login dapat memperbarui pejabat"
  on public.pejabat_struktur for update
  to authenticated
  using (not public.is_guest())
  with check (not public.is_guest());

drop policy if exists "Pengguna login dapat menghapus pejabat" on public.pejabat_struktur;
create policy "Pengguna login dapat menghapus pejabat"
  on public.pejabat_struktur for delete
  to authenticated
  using (not public.is_guest());

-- 5. profil_inspektorat: hanya SELECT untuk pengunjung.
drop policy if exists "Pengguna login dapat memperbarui profil inspektorat" on public.profil_inspektorat;
create policy "Pengguna login dapat memperbarui profil inspektorat"
  on public.profil_inspektorat for update
  to authenticated
  using (not public.is_guest())
  with check (not public.is_guest());

-- 6. Storage: pengunjung tidak boleh unggah/hapus file regulasi maupun
--    foto pejabat (semua orang tetap boleh membaca/mengunduh, seperti
--    sebelumnya, lewat policy "select ... to public" yang sudah ada).
drop policy if exists "Pengguna login dapat unggah file regulasi" on storage.objects;
create policy "Pengguna login dapat unggah file regulasi"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'regulasi-files' and not public.is_guest());

drop policy if exists "Pengguna login dapat hapus file regulasi" on storage.objects;
create policy "Pengguna login dapat hapus file regulasi"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'regulasi-files' and not public.is_guest());

drop policy if exists "Pengguna login dapat unggah foto pejabat" on storage.objects;
create policy "Pengguna login dapat unggah foto pejabat"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'pejabat-photos' and not public.is_guest());

drop policy if exists "Pengguna login dapat memperbarui foto pejabat" on storage.objects;
create policy "Pengguna login dapat memperbarui foto pejabat"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'pejabat-photos' and not public.is_guest());

drop policy if exists "Pengguna login dapat hapus foto pejabat" on storage.objects;
create policy "Pengguna login dapat hapus foto pejabat"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'pejabat-photos' and not public.is_guest());

-- =========================================================
-- Selesai. Setelah skrip ini dijalankan DAN "Anonymous Sign-Ins"
-- diaktifkan di Supabase Dashboard, tombol "Masuk sebagai Pengunjung"
-- di halaman login akan berfungsi: pengunjung bisa melihat seluruh
-- data (regulasi, profil inspektorat, struktur pejabat) tapi tidak
-- bisa menambah, mengubah, atau menghapus apa pun, dan tidak bisa
-- membuka menu Pengguna / Pengaturan / Tambah Regulasi.
-- =========================================================
