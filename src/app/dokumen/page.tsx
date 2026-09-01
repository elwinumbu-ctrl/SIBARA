import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { Regulasi } from "@/lib/types";
import { FileDown, Paperclip } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DokumenPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("regulasi")
    .select("*")
    .not("file_path", "is", null)
    .order("created_at", { ascending: false });

  const list = (data ?? []) as Regulasi[];

  return (
    <AppShell
      active="dokumen"
      email={user?.email}
      subtitle="Seluruh dokumen fisik regulasi yang telah diunggah"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-ink-subtle">
          <span className="font-semibold text-ink">{list.length}</span> regulasi memiliki dokumen pendukung
        </p>
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={Paperclip}
          title="Belum ada dokumen pendukung"
          description="Dokumen akan muncul di sini setelah diunggah pada halaman detail regulasi."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((r) => (
            <Link
              key={r.id}
              href={`/regulasi/${r.id}`}
              className="group flex items-center gap-4 bg-white/95 backdrop-blur-sm border border-white/70 rounded-2xl shadow-panel hover:shadow-card-hover hover:border-accent/30 hover-lift p-4 sm:p-5"
            >
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-accent/8 text-accent shrink-0">
                <FileDown size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-semibold text-sm text-ink truncate group-hover:text-accent transition-colors">
                  {r.judul}
                </h3>
                <p className="text-xs text-ink-faint truncate mt-0.5">
                  {r.file_nama} · {r.nomor_regulasi || "Tanpa nomor"} · {r.tahun}
                </p>
              </div>
              <StatusBadge status={r.status} size="sm" />
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
