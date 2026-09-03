import {
  LayoutDashboard,
  Building2,
  FileText,
  Layers,
  Tags,
  CalendarRange,
  Activity,
  Paperclip,
  ClipboardList,
  PieChart,
  Users,
  Settings,
  ScrollText,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  /** false = disembunyikan & diblokir untuk sesi pengunjung (guest/anonim). */
  guestAllowed?: boolean;
  /** true = tidak ditampilkan di daftar menu sidebar (aksesnya dipindah ke tempat lain, mis. logo). */
  hideFromSidebar?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, guestAllowed: true },
  {
    key: "profil-inspektorat",
    label: "Profil Inspektorat",
    href: "/profil-inspektorat",
    icon: Building2,
    guestAllowed: true,
    // Menu ini tidak lagi tampil di daftar sidebar — aksesnya dipindah ke
    // logo Sumba Barat di bagian atas sidebar, yang sekaligus berfungsi
    // sebagai tombol menuju halaman Profil Inspektorat & Pejabat.
    hideFromSidebar: true,
  },
  { key: "regulasi", label: "Regulasi", href: "/regulasi", icon: FileText, guestAllowed: true },
  { key: "jenis", label: "Jenis Regulasi", href: "/jenis", icon: Layers, guestAllowed: true },
  { key: "kategori", label: "Kategori", href: "/kategori", icon: Tags, guestAllowed: true },
  { key: "matriks-bosp", label: "Matriks BOSP", href: "/matriks-bosp", icon: ScrollText, guestAllowed: true },
  { key: "tahun", label: "Tahun", href: "/tahun", icon: CalendarRange, guestAllowed: true },
  { key: "status", label: "Status", href: "/status", icon: Activity, guestAllowed: true },
  { key: "dokumen", label: "Dokumen Pendukung", href: "/dokumen", icon: Paperclip, guestAllowed: true },
  { key: "laporan", label: "Laporan Regulasi", href: "/laporan", icon: ClipboardList, guestAllowed: true },
  { key: "rekapitulasi", label: "Rekapitulasi", href: "/rekapitulasi", icon: PieChart, guestAllowed: true },
  { key: "pengguna", label: "Pengguna", href: "/pengguna", icon: Users, guestAllowed: false },
  { key: "pengaturan", label: "Pengaturan", href: "/pengaturan", icon: Settings, guestAllowed: false },
];

/** Prefix rute yang sepenuhnya tertutup untuk sesi pengunjung (guest/anonim). */
export const GUEST_BLOCKED_PREFIXES = ["/pengguna", "/pengaturan", "/regulasi/baru"];

export function navLabel(key: string): string {
  return NAV_ITEMS.find((n) => n.key === key)?.label ?? "SIBARA";
}
