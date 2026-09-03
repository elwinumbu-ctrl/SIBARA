import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import PageHero from "@/components/PageHero";
import PejabatFotoEditor from "@/components/PejabatFotoEditor";
import type { PejabatStruktur, ProfilInspektorat } from "@/lib/types";
import {
  Building2,
  Target,
  Compass,
  ShieldCheck,
  Users,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

export const dynamic = "force-dynamic";

// Data bawaan — tampil selama admin belum mengisi/menyimpan data lewat
// menu Pengaturan -> Profil Inspektorat, atau jika skrip migrasi
// supabase/add-profil-inspektorat.sql belum dijalankan.
const DEFAULT_SELAYANG_PANDANG =
  "Inspektorat Kabupaten Sumba Barat adalah perangkat daerah yang bertugas " +
  "menyelenggarakan pengawasan internal atas penyelenggaraan urusan " +
  "pemerintahan yang menjadi kewenangan daerah, termasuk pengawasan " +
  "pengelolaan Dana Bantuan Operasional Satuan Pendidikan (BOSP) melalui " +
  "Inspektur Pembantu Wilayah IV. SIBARA hadir sebagai sistem informasi " +
  "yang mendukung transparansi dan akuntabilitas regulasi dana BOSP.";

const DEFAULT_ALAMAT = "Jl. Pemerintahan, Waikabubak, Kabupaten Sumba Barat, NTT";
const DEFAULT_TELEPON = "(0387) xxx-xxx";
const DEFAULT_EMAIL = "inspektorat@sumbabaratkab.go.id";

const DEFAULT_VISI =
  "Terwujudnya pengawasan internal pemerintahan daerah yang profesional, " +
  "independen, dan berintegritas untuk mendukung tata kelola pemerintahan " +
  "yang bersih dan akuntabel.";

const DEFAULT_MISI = [
  "Meningkatkan kualitas pengawasan internal pemerintah daerah.",
  "Mendorong akuntabilitas pengelolaan keuangan & aset daerah.",
  "Membangun sistem informasi pengawasan yang transparan.",
  "Meningkatkan kapasitas dan integritas aparatur pengawas.",
];

const DEFAULT_TUGAS_POKOK = [
  "Melaksanakan pengawasan internal terhadap kinerja dan keuangan perangkat daerah.",
  "Mengawal akuntabilitas pengelolaan Dana BOSP di satuan pendidikan.",
  "Melakukan reviu, evaluasi, pemantauan, dan pengawasan lainnya.",
  "Menyusun laporan hasil pengawasan sebagai bahan pengambilan kebijakan Bupati.",
];

interface StrukturRow {
  id: string | null;
  peran: string;
  nama: string | null;
  keterangan: string | null;
  foto_path: string | null;
}

const DEFAULT_STRUKTUR: StrukturRow[] = [
  {
    id: null,
    peran: "Inspektur",
    nama: "Weru Raddi Kaka Ora, SP",
    keterangan: "Pimpinan tertinggi Inspektorat",
    foto_path: "/pejabat/weru-raddi-kaka-ora.jpg",
  },
  {
    id: null,
    peran: "Sekretaris",
    nama: "Simon Malo Kii, S.Pd, M.Si",
    keterangan: "Koordinasi administrasi & program",
    foto_path: "/pejabat/simon-malo-kii.jpg",
  },
  {
    id: null,
    peran: "Inspektur Pembantu Wilayah I",
    nama: "Yuliana Tineke Evi Malo, ST",
    keterangan: "Wilayah kerja I",
    foto_path: "/pejabat/evi-malo.jpg",
  },
  {
    id: null,
    peran: "Inspektur Pembantu Wilayah II",
    nama: "Betseba L. Mude, S.Sos",
    keterangan: "Wilayah kerja II",
    foto_path: "/pejabat/betsy-mude.jpg",
  },
  {
    id: null,
    peran: "Inspektur Pembantu Wilayah III",
    nama: "drh. Maimun Indriany Hamzah, S.KH",
    keterangan: "Wilayah kerja III",
    foto_path: "/pejabat/maimun-hamzah.jpg",
  },
  {
    id: null,
    peran: "Inspektur Pembantu Wilayah IV",
    nama: "Abdullah Daud, SE",
    keterangan: "Pengawasan Dana BOSP",
    foto_path: "/pejabat/abdullah-daud.jpg",
  },
  {
    id: null,
    peran: "Inspektur Pembantu Wilayah V",
    nama: "Yunias Baga Wulla Male, SP",
    keterangan: "Wilayah kerja V",
    foto_path: "/pejabat/yunias-baga-wulla-male.jpg",
  },
];

export default async function ProfilInspektoratPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profilRow }, { data: pejabatRows }] = await Promise.all([
    supabase.from("profil_inspektorat").select("*").eq("id", 1).maybeSingle(),
    supabase.from("pejabat_struktur").select("*").order("urutan", { ascending: true }),
  ]);

  const profil = profilRow as ProfilInspektorat | null;
  const pejabatList = (pejabatRows ?? []) as PejabatStruktur[];

  const selayangPandang = profil?.selayang_pandang?.trim() || DEFAULT_SELAYANG_PANDANG;
  const alamat = profil?.alamat?.trim() || DEFAULT_ALAMAT;
  const telepon = profil?.telepon?.trim() || DEFAULT_TELEPON;
  const email = profil?.email?.trim() || DEFAULT_EMAIL;
  const visi = profil?.visi?.trim() || DEFAULT_VISI;
  const misi = profil?.misi && profil.misi.length > 0 ? profil.misi : DEFAULT_MISI;
  const tugasPokok =
    profil?.tugas_pokok && profil.tugas_pokok.length > 0 ? profil.tugas_pokok : DEFAULT_TUGAS_POKOK;
  const struktur: StrukturRow[] =
    pejabatList.length > 0
      ? pejabatList.map((p) => ({
          id: p.id,
          peran: p.peran,
          nama: p.nama,
          keterangan: p.keterangan,
          foto_path: p.foto_path,
        }))
      : DEFAULT_STRUKTUR;

  const isGuest = Boolean(user?.is_anonymous);

  return (
    <AppShell
      active="profil-inspektorat"
      email={user?.email}
      subtitle="Tentang Inspektorat Kabupaten Sumba Barat"
      showAddButton={false}
      isGuest={isGuest}
      dark
    >
      <PageHero
        icon={Building2}
        eyebrow="Tentang Kami"
        title="Profil Inspektorat"
        description="Inspektorat Kabupaten Sumba Barat — unsur pengawas penyelenggaraan pemerintahan daerah."
      />

      {/* Ringkasan identitas */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 surface-card-dark p-5 sm:p-6">
          <h3 className="font-display text-base font-semibold text-white mb-2">
            Selayang Pandang
          </h3>
          <p className="text-sm text-white/60 leading-relaxed whitespace-pre-line">
            {selayangPandang}
          </p>
        </div>
        <div className="surface-card-dark p-5 sm:p-6">
          <h3 className="font-display text-base font-semibold text-white mb-3">
            Kontak
          </h3>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="text-cyan shrink-0 mt-0.5" />
              <span>{alamat}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="text-cyan shrink-0" />
              <span>{telepon}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="text-cyan shrink-0" />
              <span>{email}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Visi & Misi */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="surface-card-dark p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cyan/10 text-cyan">
              <Compass size={18} strokeWidth={1.9} />
            </span>
            <h3 className="font-display text-base font-semibold text-white">Visi</h3>
          </div>
          <p className="text-sm text-white/60 leading-relaxed whitespace-pre-line">
            {visi}
          </p>
        </div>
        <div className="surface-card-dark p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent/15 text-accent">
              <Target size={18} strokeWidth={1.9} />
            </span>
            <h3 className="font-display text-base font-semibold text-white">Misi</h3>
          </div>
          <ul className="text-sm text-white/60 leading-relaxed space-y-1.5 list-disc list-inside">
            {misi.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tugas Pokok & Fungsi */}
      <div className="surface-card-dark p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cyan/10 text-cyan">
            <ShieldCheck size={18} strokeWidth={1.9} />
          </span>
          <h3 className="font-display text-base font-semibold text-white">
            Tugas Pokok & Fungsi
          </h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {tugasPokok.map((tugas, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-white/5 border border-white/8 p-3.5">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan/15 text-cyan text-xs font-semibold shrink-0">
                {i + 1}
              </span>
              <p className="text-sm text-white/65 leading-relaxed">{tugas}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Struktur Organisasi */}
      <div className="surface-card-dark p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent/15 text-accent">
            <Users size={18} strokeWidth={1.9} />
          </span>
          <h3 className="font-display text-base font-semibold text-white">
            Struktur Organisasi
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {struktur.map((row, i) => (
            <div
              key={row.id ?? i}
              className="flex items-center gap-3.5 rounded-xl bg-white/5 border border-white/8 p-3.5"
            >
              <PejabatFotoEditor
                id={row.id}
                peran={row.peran}
                nama={row.nama}
                keterangan={row.keterangan}
                urutan={i + 1}
                fotoPath={row.foto_path}
                readOnly={isGuest}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{row.peran}</p>
                <p className="text-xs text-white/55 truncate">{row.nama || "—"}</p>
              </div>
            </div>
          ))}
        </div>

        {!isGuest && (
          <p className="text-xs text-white/30 mt-4">
            * Arahkan kursor ke foto lalu klik untuk mengunggah atau mengganti foto pejabat.
            Data lengkap juga dapat diperbarui melalui menu Pengaturan → Profil Inspektorat.
          </p>
        )}
      </div>
    </AppShell>
  );
}
