import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import PageHero from "@/components/PageHero";
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

const TUGAS_POKOK = [
  "Melaksanakan pengawasan internal terhadap kinerja dan keuangan perangkat daerah.",
  "Mengawal akuntabilitas pengelolaan Dana BOSP di satuan pendidikan.",
  "Melakukan reviu, evaluasi, pemantauan, dan pengawasan lainnya.",
  "Menyusun laporan hasil pengawasan sebagai bahan pengambilan kebijakan Bupati.",
];

const STRUKTUR = [
  { peran: "Inspektur", nama: "—", keterangan: "Pimpinan tertinggi Inspektorat" },
  { peran: "Sekretaris", nama: "—", keterangan: "Koordinasi administrasi & program" },
  { peran: "Inspektur Pembantu Wilayah I", nama: "—", keterangan: "Wilayah kerja I" },
  { peran: "Inspektur Pembantu Wilayah II", nama: "—", keterangan: "Wilayah kerja II" },
  { peran: "Inspektur Pembantu Wilayah III", nama: "—", keterangan: "Wilayah kerja III" },
  { peran: "Inspektur Pembantu Wilayah IV", nama: "—", keterangan: "Pengawasan Dana BOSP" },
];

export default async function ProfilInspektoratPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AppShell
      active="profil-inspektorat"
      email={user?.email}
      subtitle="Tentang Inspektorat Kabupaten Sumba Barat"
      showAddButton={false}
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
          <p className="text-sm text-white/60 leading-relaxed">
            Inspektorat Kabupaten Sumba Barat adalah perangkat daerah yang bertugas
            menyelenggarakan pengawasan internal atas penyelenggaraan urusan
            pemerintahan yang menjadi kewenangan daerah, termasuk pengawasan
            pengelolaan Dana Bantuan Operasional Satuan Pendidikan (BOSP) melalui
            Inspektur Pembantu Wilayah IV. SIBARA hadir sebagai sistem informasi
            yang mendukung transparansi dan akuntabilitas regulasi dana BOSP.
          </p>
        </div>
        <div className="surface-card-dark p-5 sm:p-6">
          <h3 className="font-display text-base font-semibold text-white mb-3">
            Kontak
          </h3>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="text-cyan shrink-0 mt-0.5" />
              <span>Jl. Pemerintahan, Waikabubak, Kabupaten Sumba Barat, NTT</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="text-cyan shrink-0" />
              <span>(0387) xxx-xxx</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="text-cyan shrink-0" />
              <span>inspektorat@sumbabaratkab.go.id</span>
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
          <p className="text-sm text-white/60 leading-relaxed">
            Terwujudnya pengawasan internal pemerintahan daerah yang profesional,
            independen, dan berintegritas untuk mendukung tata kelola pemerintahan
            yang bersih dan akuntabel.
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
            <li>Meningkatkan kualitas pengawasan internal pemerintah daerah.</li>
            <li>Mendorong akuntabilitas pengelolaan keuangan & aset daerah.</li>
            <li>Membangun sistem informasi pengawasan yang transparan.</li>
            <li>Meningkatkan kapasitas dan integritas aparatur pengawas.</li>
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
          {TUGAS_POKOK.map((tugas, i) => (
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
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm min-w-[540px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-white/40 border-b border-white/10">
                <th className="py-2.5 px-3 font-semibold">Jabatan</th>
                <th className="py-2.5 px-3 font-semibold">Nama</th>
                <th className="py-2.5 px-3 font-semibold">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {STRUKTUR.map((row, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0">
                  <td className="py-3 px-3 text-white/80 font-medium">{row.peran}</td>
                  <td className="py-3 px-3 text-white/55">{row.nama}</td>
                  <td className="py-3 px-3 text-white/40">{row.keterangan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-white/30 mt-3">
          * Data nama pejabat dapat diperbarui melalui menu Pengaturan.
        </p>
      </div>
    </AppShell>
  );
}
