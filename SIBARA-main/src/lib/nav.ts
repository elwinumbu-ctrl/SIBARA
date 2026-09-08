import {
  LayoutDashboard,
  Building2,
  FileText,
  Layers,
  Tags,
  CalendarRange,
  Activity,
  Paperclip,
  PieChart,
  Settings,
  ScrollText,
  Users,
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
  /** true = hanya tampil untuk pengguna dengan role admin (mis. Manajemen Pengguna). */
  adminOnly?: boolean;
  /** Sub-menu (opsional). Jika diisi, item ini dirender sebagai grup yang
   * bisa dibuka/tutup (accordion) di sidebar, berisi tautan-tautan anak. */
  children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  // "Profil Inspektorat" dipindah jadi sub-menu dari "Beranda" (accordion),
  // selain tetap bisa diakses lewat logo Sumba Barat di atas sidebar.
  {
    key: "dashboard",
    label: "Beranda",
    href: "/dashboard",
    icon: LayoutDashboard,
    guestAllowed: true,
    children: [
      { key: "dashboard", label: "Beranda", href: "/dashboard", icon: LayoutDashboard, guestAllowed: true },
      { key: "profil-inspektorat", label: "Profil Inspektorat", href: "/profil-inspektorat", icon: Building2, guestAllowed: true },
    ],
  },
  // Semua menu terkait regulasi digabung dalam satu grup "Regulasi" di
  // sidebar (accordion). Setiap anak tetap memakai key & href asalnya,
  // sehingga seluruh halaman, filter, dan hak akses guest tidak berubah.
  {
    key: "regulasi",
    label: "Regulasi",
    href: "/regulasi",
    icon: FileText,
    guestAllowed: true,
    children: [
      { key: "regulasi", label: "Semua Regulasi", href: "/regulasi", icon: FileText, guestAllowed: true },
      { key: "jenis", label: "Jenis Regulasi", href: "/jenis", icon: Layers, guestAllowed: true },
      { key: "kategori", label: "Kategori", href: "/kategori", icon: Tags, guestAllowed: true },
      { key: "matriks-bosp", label: "Matriks BOSP", href: "/matriks-bosp", icon: ScrollText, guestAllowed: true },
      { key: "tahun", label: "Tahun", href: "/tahun", icon: CalendarRange, guestAllowed: true },
      { key: "status", label: "Status", href: "/status", icon: Activity, guestAllowed: true },
      { key: "dokumen", label: "Dokumen Pendukung", href: "/dokumen", icon: Paperclip, guestAllowed: true },
      // "Laporan Regulasi" digabung menjadi sub-menu (tab) di dalam
      // halaman Rekapitulasi (lihat src/app/rekapitulasi/page.tsx),
      // bukan menu terpisah di sidebar lagi.
      { key: "rekapitulasi", label: "Rekapitulasi", href: "/rekapitulasi", icon: PieChart, guestAllowed: true },
    ],
  },
  // Manajemen Pengguna: hanya untuk admin. Item ini sengaja TIDAK diberi
  // "children", jadi selalu tampil sebagai tautan langsung (bukan
  // accordion) di sidebar, konsisten dengan "Pengaturan" di bawahnya.
  { key: "pengguna", label: "Manajemen Pengguna", href: "/pengguna", icon: Users, guestAllowed: false, adminOnly: true },
  { key: "pengaturan", label: "Pengaturan", href: "/pengaturan", icon: Settings, guestAllowed: false },
];

/** Prefix rute yang sepenuhnya tertutup untuk sesi pengunjung (guest/anonim). */
export const GUEST_BLOCKED_PREFIXES = ["/pengguna", "/pengaturan", "/regulasi/baru"];

/** Daftar rata (flat) semua item termasuk anak dari grup, untuk pencarian by key. */
export function flatNavItems(): NavItem[] {
  return NAV_ITEMS.flatMap((item) => (item.children ? item.children : [item]));
}

export function findNavItem(key: string): NavItem | undefined {
  return flatNavItems().find((n) => n.key === key);
}

export function navLabel(key: string): string {
  return findNavItem(key)?.label ?? "SIBARA";
}
