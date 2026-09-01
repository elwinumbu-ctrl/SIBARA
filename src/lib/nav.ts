import {
  LayoutDashboard,
  FileText,
  Tags,
  CalendarRange,
  Activity,
  Paperclip,
  ClipboardList,
  PieChart,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "regulasi", label: "Regulasi", href: "/regulasi", icon: FileText },
  { key: "kategori", label: "Kategori", href: "/kategori", icon: Tags },
  { key: "tahun", label: "Tahun", href: "/tahun", icon: CalendarRange },
  { key: "status", label: "Status", href: "/status", icon: Activity },
  { key: "dokumen", label: "Dokumen Pendukung", href: "/dokumen", icon: Paperclip },
  { key: "laporan", label: "Laporan Regulasi", href: "/laporan", icon: ClipboardList },
  { key: "rekapitulasi", label: "Rekapitulasi", href: "/rekapitulasi", icon: PieChart },
  { key: "pengguna", label: "Pengguna", href: "/pengguna", icon: Users },
  { key: "pengaturan", label: "Pengaturan", href: "/pengaturan", icon: Settings },
];

export function navLabel(key: string): string {
  return NAV_ITEMS.find((n) => n.key === key)?.label ?? "SIBARA";
}
