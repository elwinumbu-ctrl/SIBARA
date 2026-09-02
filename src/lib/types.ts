export type StatusRegulasi = "berlaku" | "ditinjau" | "dicabut";

export interface Regulasi {
  id: string;
  judul: string;
  nomor_regulasi: string | null;
  jenis: string;
  instansi_penerbit: string;
  tahun: number;
  kategori: string;
  status: StatusRegulasi;
  deskripsi: string | null;
  link_resmi: string | null;
  file_path: string | null;
  file_nama: string | null;
  dibuat_oleh: string | null;
  created_at: string;
  updated_at: string;
}

export const JENIS_REGULASI = [
  "Undang-Undang",
  "Peraturan Pemerintah",
  "Peraturan Presiden",
  "Peraturan Menteri",
  "Peraturan Daerah",
  "Peraturan Bupati",
  "Peraturan Gubernur",
  "Surat Edaran",
  "Petunjuk Teknis",
  "Lainnya",
];

export const KATEGORI_REGULASI = [
  "Perencanaan",
  "Penggunaan Dana",
  "Pelaporan",
  "Pengawasan",
  "Pengadaan Barang/Jasa",
  "Tata Kelola Sekolah",
  "Lainnya",
];

// ---- Manajemen Pengguna ----

export type PeranPengguna = "admin" | "auditor";

export interface Profile {
  id: string;
  nama_lengkap: string | null;
  role: PeranPengguna;
  created_at: string;
  updated_at: string;
}

export interface PenggunaListItem {
  id: string;
  email: string | null;
  nama_lengkap: string | null;
  role: PeranPengguna;
  created_at: string;
}

// ---- Profil Inspektorat (dapat diedit lewat Pengaturan) ----

export interface ProfilInspektorat {
  id: number;
  selayang_pandang: string | null;
  alamat: string | null;
  telepon: string | null;
  email: string | null;
  visi: string | null;
  misi: string[];
  tugas_pokok: string[];
  updated_at: string;
}

export interface PejabatStruktur {
  id: string;
  peran: string;
  nama: string | null;
  keterangan: string | null;
  foto_path: string | null;
  urutan: number;
  created_at: string;
  updated_at: string;
}
