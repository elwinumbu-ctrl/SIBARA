import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import PageHero from "@/components/PageHero";
import EmptyState from "@/components/EmptyState";
import RegulasiCard from "@/components/RegulasiCard";
import { Regulasi } from "@/lib/types";
import { Search, FileSearch, Layers, Tags, CalendarRange, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

const QUICK_LINKS = [
  { label: "Jenis Regulasi", href: "/jenis", icon: Layers },
  { label: "Kategori", href: "/kategori", icon: Tags },
  { label: "Tahun", href: "/tahun", icon: CalendarRange },
  { label: "Status", href: "/status", icon: Activity },
];

export default async function PencarianPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isGuest = Boolean(user?.is_anonymous);

  const q = (searchParams.q ?? "").trim();
  // Dukung pencarian multi kata kunci: setiap kata dipisah spasi harus
  // sama-sama ditemukan (AND antar kata kunci), tapi masing-masing kata
  // kunci boleh cocok di kolom apa saja (OR antar kolom untuk kata itu).
  // Contoh: "bosp 2024 permendikbud" -> baris harus memuat ketiga kata
  // itu, tersebar di judul/nomor/jenis/kategori/instansi/deskripsi.
  const keywords = Array.from(
    new Set(
      q
        .split(/\s+/)
        .map((k) => k.trim())
        .filter(Boolean)
    )
  );

  let list: Regulasi[] = [];
  let error: string | null = null;

  if (keywords.length > 0) {
    let query = supabase.from("regulasi").select("*");

    for (const keyword of keywords) {
      const safeKeyword = keyword.replace(/[%,]/g, "");
      query = query.or(
        `judul.ilike.%${safeKeyword}%,nomor_regulasi.ilike.%${safeKeyword}%,deskripsi.ilike.%${safeKeyword}%,jenis.ilike.%${safeKeyword}%,kategori.ilike.%${safeKeyword}%,instansi_penerbit.ilike.%${safeKeyword}%`
      );
    }

    const { data, error: queryError } = await query.order("created_at", { ascending: false });

    if (queryError) {
      error = queryError.message;
    } else {
      list = (data ?? []) as Regulasi[];
    }
  }

  return (
    <AppShell
      active="pencarian"
      email={user?.email}
      subtitle="Cari cepat ke seluruh Bank Regulasi Dana BOSP"
      isGuest={isGuest}
      showAddButton={false}
      dark
    >
      <PageHero
        icon={Search}
        eyebrow="Bank Regulasi"
        title="Pencarian"
        description="Ketik satu atau beberapa kata kunci (judul, nomor regulasi, jenis, kategori, atau instansi penerbit) — dipisah spasi untuk mempersempit hasil."
      />

      <form action="/pencarian" method="get" className="surface-card-dark rounded-2xl p-4 sm:p-5 mb-6">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
          />
          <input
            type="text"
            name="q"
            defaultValue={q}
            autoFocus
            placeholder="Contoh: bosp 2024 permendikbud"
            className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-24 py-3 text-sm text-white placeholder:text-white/35 focus:border-cyan/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan/20 transition-shadow"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent to-cyan text-white text-sm font-semibold px-4 shadow-glow hover:brightness-110 transition-all"
          >
            Cari
          </button>
        </div>
        <p className="text-[11px] text-white/35 mt-2 pl-1">
          Tips: pisahkan dengan spasi untuk mencari beberapa kata kunci sekaligus — hasil harus
          memuat semua kata kunci tersebut (boleh di kolom yang berbeda-beda).
        </p>
      </form>

      {!q && (
        <>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-3">
            Atau telusuri berdasarkan
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
            {QUICK_LINKS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="surface-card-dark hover-lift flex items-center gap-3 p-4 rounded-xl hover:border-cyan/30 transition-colors"
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/8 text-cyan shrink-0">
                  <Icon size={16} strokeWidth={1.9} />
                </span>
                <span className="text-sm font-medium text-white truncate">{label}</span>
              </Link>
            ))}
          </div>
        </>
      )}

      {error && (
        <p className="text-sm text-status-dicabut bg-status-dicabut/10 border border-status-dicabut/20 rounded-lg px-4 py-3 mb-4">
          Gagal memuat data: {error}
        </p>
      )}

      {q && !error && (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <p className="text-xs text-white/50">
              Menemukan <span className="font-semibold text-white">{list.length}</span> hasil untuk
            </p>
            {keywords.map((keyword) => (
              <span
                key={keyword}
                className="text-xs font-medium rounded-md px-2 py-0.5 bg-cyan/10 text-cyan"
              >
                {keyword}
              </span>
            ))}
          </div>

          {list.length === 0 ? (
            <EmptyState
              icon={FileSearch}
              title="Tidak ada regulasi yang cocok"
              description="Coba kata kunci lain yang lebih sedikit atau lebih umum, atau periksa ejaan nomor/judul regulasi."
              dark
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((regulasi) => (
                <RegulasiCard key={regulasi.id} regulasi={regulasi} view="grid" dark />
              ))}
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}
