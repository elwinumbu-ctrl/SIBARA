import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import PageHero from "@/components/PageHero";
import {
  ShieldAlert,
  ListChecks,
  ScrollText,
  AlertTriangle,
} from "lucide-react";

export const dynamic = "force-dynamic";

// Ringkasan acuan — bukan salinan lengkap pasal. Rujukan utama:
// Permendikdasmen Nomor 8 Tahun 2026 tentang Petunjuk Teknis Pengelolaan
// Dana BOSP (menggantikan Permendikdasmen No. 8/2025 & Permendikbud 63/2022),
// khususnya Pasal 51 & Lampiran I (komponen & prioritas penggunaan) dan
// Pasal 66 (larangan bagi Satuan Pendidikan) serta ketentuan larangan bagi
// Pemerintah Daerah. Selalu rujuk salinan resmi peraturan untuk kepastian
// hukum — data lengkapnya dapat diunggah di menu Regulasi.

interface MatrixItem {
  judul: string;
  keterangan: string;
  ref: string;
}

const PRIORITAS: MatrixItem[] = [
  {
    judul: "Kegiatan pembelajaran & ekstrakurikuler",
    keterangan:
      "Buku teks & non-teks, alat peraga, media pembelajaran, serta kegiatan olahraga/seni/pengembangan minat-bakat yang menunjang kurikulum.",
    ref: "Psl 51 & Lampiran I",
  },
  {
    judul: "Evaluasi & asesmen pembelajaran",
    keterangan:
      "Pembiayaan ujian satuan pendidikan, Asesmen Nasional, dan survei karakter peserta didik.",
    ref: "Psl 51 & Lampiran I",
  },
  {
    judul: "Administrasi satuan pendidikan",
    keterangan:
      "Alat tulis kantor, bahan habis pakai, serta biaya daya & jasa (listrik, air, internet) untuk mendukung layanan belajar.",
    ref: "Psl 51 & Lampiran I",
  },
  {
    judul: "Pemeliharaan sarana & prasarana ringan",
    keterangan:
      "Perbaikan ringan fasilitas belajar-mengajar; perbaikan kategori rusak sedang/berat berada di luar cakupan Dana BOSP.",
    ref: "Psl 51 & Lampiran I",
  },
  {
    judul: "Pengembangan profesionalisme GTK",
    keterangan:
      "Pelatihan, bimbingan teknis, workshop, dan seminar bagi guru & tenaga kependidikan.",
    ref: "Psl 51 & Lampiran I",
  },
  {
    judul: "Honor pendidik & tenaga kependidikan non-ASN",
    keterangan:
      "Wajib terdata di Dapodik & ber-NUPTK, tidak sedang menerima tunjangan profesi. Maksimal 20% (negeri) / 40% (swasta) dari pagu alokasi honor.",
    ref: "Psl 51 ayat (4)",
  },
  {
    judul: "Penyediaan buku",
    keterangan:
      "Alokasi minimal wajib: BOP PAUD ≥5%, BOS & BOP Kesetaraan ≥10% dari dana reguler yang diterima.",
    ref: "Lampiran I",
  },
  {
    judul: "Kesejahteraan & transportasi peserta didik",
    keterangan:
      "Biaya transportasi bagi peserta didik kurang mampu dan kebutuhan mendesak lain yang menunjang akses pendidikan.",
    ref: "Psl 51 & Lampiran I",
  },
  {
    judul: "Alat kebersihan, kesehatan & gizi (khusus PAUD)",
    keterangan:
      "Sabun, disinfektan, perlengkapan P3K, serta makanan/minuman sehat bagi peserta didik PAUD.",
    ref: "Psl 51 & Lampiran I",
  },
  {
    judul: "Pengadaan barang/jasa sesuai mekanisme resmi",
    keterangan:
      "Dilaksanakan melalui ARKAS/SIPLah sesuai ketentuan pengadaan barang/jasa oleh Satuan Pendidikan.",
    ref: "Psl 51 ayat (3)",
  },
];

const LARANGAN: MatrixItem[] = [
  {
    judul: "Transfer dana ke rekening pribadi/pihak lain",
    keterangan:
      "Dana BOSP dipindahkan ke luar peruntukan resminya untuk kepentingan pribadi atau pihak lain.",
    ref: "Psl 66 ayat (1) huruf a",
  },
  {
    judul: "Membungakan dana untuk kepentingan pribadi",
    keterangan: "Memanfaatkan dana untuk memperoleh bunga/keuntungan pribadi.",
    ref: "Psl 66 ayat (1) huruf b",
  },
  {
    judul: "Meminjamkan dana kepada pihak lain",
    keterangan: "Dana BOSP dipinjamkan, baik ke perorangan maupun lembaga lain.",
    ref: "Psl 66 ayat (1) huruf c",
  },
  {
    judul: "Aplikasi pelaporan/pendataan di luar sistem resmi",
    keterangan:
      "Membeli perangkat lunak pelaporan keuangan atau menyewa aplikasi pendataan/PPDB daring di luar sistem yang disediakan Kemendikdasmen.",
    ref: "Psl 66 ayat (1) huruf d–e",
  },
  {
    judul: "Kegiatan di luar prioritas satuan pendidikan",
    keterangan:
      "Termasuk studi banding dan tur studi/karya wisata yang tidak menunjang tujuan pembelajaran.",
    ref: "Psl 66 ayat (1) huruf f",
  },
  {
    judul: "Membangun gedung/ruangan baru",
    keterangan:
      "Kecuali penyediaan jamban/WC atau kantin sehat bagi SD/SMP yang belum memilikinya.",
    ref: "Psl 66 ayat (1)",
  },
  {
    judul: "Perbaikan fasilitas rusak sedang/berat",
    keterangan: "Di luar cakupan pemeliharaan ringan yang dibiayai Dana BOSP.",
    ref: "Psl 66 ayat (1)",
  },
  {
    judul: "LKS & bahan yang tidak menunjang pembelajaran",
    keterangan: "Pembelian Lembar Kerja Siswa atau alat/bahan yang tidak relevan dengan proses belajar.",
    ref: "Larangan BOS",
  },
  {
    judul: "Pakaian/seragam/sepatu untuk kepentingan pribadi",
    keterangan: "Bagi guru atau peserta didik, selama bukan berstatus inventaris sekolah.",
    ref: "Larangan BOS",
  },
  {
    judul: "Duplikasi pembiayaan",
    keterangan: "Membiayai kegiatan yang sudah dibiayai penuh oleh sumber dana sah lainnya.",
    ref: "Larangan BOS",
  },
  {
    judul: "Iuran kegiatan UPTD/dinas/pihak lain",
    keterangan: "Membayar iuran kegiatan yang diselenggarakan UPTD kecamatan/kabupaten/kota/provinsi/pusat atau pihak lain.",
    ref: "Larangan BOS",
  },
  {
    judul: "Iuran/penyelenggaraan upacara & acara keagamaan",
    keterangan: "Pembiayaan iuran peringatan hari besar nasional maupun penyelenggaraan upacara/acara keagamaan.",
    ref: "Larangan BOS",
  },
  {
    judul: "Menjadi/mengarahkan ke distributor tertentu",
    keterangan:
      "Larangan bagi Pemerintah Daerah untuk menjadi distributor/pengecer atau mengarahkan pembelian buku/barang ke pihak tertentu.",
    ref: "Larangan Pemda",
  },
  {
    judul: "Menghambat pencairan & penggunaan dana",
    keterangan: "Larangan bagi Pemerintah Daerah menghambat proses pencairan dan penggunaan Dana BOSP oleh satuan pendidikan.",
    ref: "Larangan Pemda",
  },
];

export default async function MatriksBOSPPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AppShell
      active="matriks-bosp"
      email={user?.email}
      subtitle="Acuan cepat penggunaan Dana BOSP untuk pengawasan"
      showAddButton={false}
      dark
    >
      <PageHero
        icon={ScrollText}
        eyebrow="Acuan Pengawasan"
        title="Matriks Larangan & Prioritas Dana BOSP"
        description="Ringkasan acuan penggunaan Dana BOSP berdasarkan Permendikdasmen Nomor 8 Tahun 2026 tentang Juknis Pengelolaan Dana BOSP."
      />

      <div className="surface-card-dark p-4 sm:p-5 mb-6 flex items-start gap-3">
        <AlertTriangle size={18} className="text-status-ditinjau shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
          Halaman ini adalah <span className="text-white/80 font-medium">ringkasan acuan cepat</span>, bukan
          salinan lengkap pasal. Untuk kepastian hukum, selalu rujuk salinan resmi Permendikdasmen Nomor 8
          Tahun 2026 (atau regulasi terbaru yang berlaku) melalui menu{" "}
          <span className="text-cyan">Regulasi</span>.
        </p>
      </div>

      {/* Matriks Prioritas */}
      <div className="surface-card-dark p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cyan/10 text-cyan">
            <ListChecks size={18} strokeWidth={1.9} />
          </span>
          <div>
            <h3 className="font-display text-base font-semibold text-white">
              Matriks Prioritas Penggunaan
            </h3>
            <p className="text-xs text-white/40 mt-0.5">
              Komponen yang diperbolehkan & didahulukan dalam RKAS
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {PRIORITAS.map((item, i) => (
            <div
              key={item.judul}
              className="flex items-start gap-3 rounded-xl bg-white/5 border border-white/8 p-3.5"
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan/15 text-cyan text-xs font-semibold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white leading-snug">{item.judul}</p>
                <p className="text-xs text-white/55 leading-relaxed mt-1">{item.keterangan}</p>
                <p className="text-[10px] uppercase tracking-wide text-cyan/70 mt-1.5">{item.ref}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Matriks Larangan */}
      <div className="surface-card-dark p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-status-dicabut/15 text-status-dicabut">
            <ShieldAlert size={18} strokeWidth={1.9} />
          </span>
          <div>
            <h3 className="font-display text-base font-semibold text-white">
              Matriks Larangan Penggunaan
            </h3>
            <p className="text-xs text-white/40 mt-0.5">
              Hal-hal yang dilarang dan berpotensi menjadi temuan pengawasan
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {LARANGAN.map((item, i) => (
            <div
              key={item.judul}
              className="flex items-start gap-3 rounded-xl bg-white/5 border border-white/8 p-3.5"
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-status-dicabut/15 text-status-dicabut text-xs font-semibold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white leading-snug">{item.judul}</p>
                <p className="text-xs text-white/55 leading-relaxed mt-1">{item.keterangan}</p>
                <p className="text-[10px] uppercase tracking-wide text-status-dicabut/70 mt-1.5">{item.ref}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
