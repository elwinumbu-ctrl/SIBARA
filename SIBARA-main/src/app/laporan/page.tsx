import { redirect } from "next/navigation";

// "Laporan Regulasi" sudah digabung menjadi sub-menu (tab) di dalam
// halaman Rekapitulasi. Rute lama tetap ada dan diarahkan otomatis
// supaya tautan/bookmark lama tidak rusak.
export default function LaporanPage() {
  redirect("/rekapitulasi?tab=laporan");
}
