import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
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
        <div className="text-center py-16 bg-white border border-dashed border-border-strong rounded-2xl">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/8 text-primary mb-4">
            <Paperclip size={20} strokeWidth={1.7} />
          </div>
          <p className="font-display font-semibold text-lg text-ink mb-1">
            Belum ada dokumen pendukung
          </p>
          <p className="text-sm text-ink-subtle max-w-sm mx-auto">
            Dokumen akan muncul di sini setelah diunggah pada halaman detail regulasi.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((r) => (
            <Link
              key={r.id}
              href={`/regulasi/${r.id}`}
              className="group flex items-center gap-4 bg-white border border-border rounded-2xl shadow-card hover:shadow-card-hover hover-lift p-4 sm:p-5"
            >
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/8 text-primary shrink-0">
                <FileDown size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-semibold text-sm text-ink truncate group-hover:text-primary transition-colors">
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
