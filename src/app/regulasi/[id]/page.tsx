"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import { JENIS_REGULASI, KATEGORI_REGULASI, Regulasi } from "@/lib/types";

export default function DetailRegulasiPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [regulasi, setRegulasi] = useState<Regulasi | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("regulasi")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError("Regulasi tidak ditemukan.");
        setLoading(false);
        return;
      }

      setRegulasi(data as Regulasi);

      if (data.file_path) {
        const { data: pub } = supabase.storage
          .from("regulasi-files")
          .getPublicUrl(data.file_path);
        setFileUrl(pub.publicUrl);
      }

      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSave() {
    if (!regulasi) return;
    setSaving(true);
    setError(null);

    const { error } = await supabase
      .from("regulasi")
      .update({
        judul: regulasi.judul,
        nomor_regulasi: regulasi.nomor_regulasi,
        jenis: regulasi.jenis,
        instansi_penerbit: regulasi.instansi_penerbit,
        tahun: regulasi.tahun,
        kategori: regulasi.kategori,
        status: regulasi.status,
        deskripsi: regulasi.deskripsi,
        link_resmi: regulasi.link_resmi,
      })
      .eq("id", regulasi.id);

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }
    setEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!regulasi) return;
    const confirmed = window.confirm(
      `Hapus regulasi "${regulasi.judul}"? Tindakan ini tidak dapat dibatalkan.`
    );
    if (!confirmed) return;

    if (regulasi.file_path) {
      await supabase.storage.from("regulasi-files").remove([regulasi.file_path]);
    }
    const { error } = await supabase
      .from("regulasi")
      .delete()
      .eq("id", regulasi.id);

    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center text-sm text-slate-muted">
          Memuat data regulasi...
        </main>
      </div>
    );
  }

  if (error && !regulasi) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-sm text-status-dicabut">{error}</p>
        </main>
      </div>
    );
  }

  if (!regulasi) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-slate-muted hover:text-ink mb-4 inline-block"
        >
          ← Kembali ke daftar
        </button>

        <div className="bg-paper-card border border-paper-line rounded-lg shadow-card p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <span className="font-mono text-xs text-slate-muted">
              {regulasi.nomor_regulasi || "Tanpa nomor"} · {regulasi.tahun}
            </span>
            <StatusBadge status={regulasi.status} />
          </div>

          {!editing ? (
            <>
              <h1 className="font-display text-xl text-ink mb-3">
                {regulasi.judul}
              </h1>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-muted mb-4">
                <span>
                  <strong className="text-ink">Jenis:</strong> {regulasi.jenis}
                </span>
                <span>
                  <strong className="text-ink">Instansi:</strong>{" "}
                  {regulasi.instansi_penerbit}
                </span>
                <span>
                  <strong className="text-ink">Kategori:</strong>{" "}
                  {regulasi.kategori}
                </span>
              </div>

              {regulasi.deskripsi && (
                <p className="text-sm text-slate-text leading-relaxed border-t border-paper-line pt-4 mb-4">
                  {regulasi.deskripsi}
                </p>
              )}

              <div className="flex flex-wrap gap-3 mb-4">
                {regulasi.link_resmi && (
                  <a
                    href={regulasi.link_resmi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink underline underline-offset-2 hover:text-seal"
                  >
                    Buka sumber resmi ↗
                  </a>
                )}
                {fileUrl && (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink underline underline-offset-2 hover:text-seal"
                  >
                    📎 Unduh {regulasi.file_nama || "dokumen"} ↗
                  </a>
                )}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-paper-line">
                <button
                  onClick={() => setEditing(true)}
                  className="rounded-md bg-ink text-paper-card text-sm font-medium px-4 py-2 hover:bg-ink-light transition-colors"
                >
                  Ubah Data
                </button>
                <button
                  onClick={handleDelete}
                  className="text-sm text-status-dicabut hover:underline"
                >
                  Hapus regulasi
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-muted mb-1">
                  Judul regulasi
                </label>
                <input
                  value={regulasi.judul}
                  onChange={(e) =>
                    setRegulasi({ ...regulasi, judul: e.target.value })
                  }
                  className="w-full rounded-md border border-paper-line bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-muted mb-1">
                    Nomor regulasi
                  </label>
                  <input
                    value={regulasi.nomor_regulasi ?? ""}
                    onChange={(e) =>
                      setRegulasi({
                        ...regulasi,
                        nomor_regulasi: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-paper-line bg-white px-3 py-2 text-sm font-mono focus:border-ink focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-muted mb-1">
                    Tahun terbit
                  </label>
                  <input
                    type="number"
                    value={regulasi.tahun}
                    onChange={(e) =>
                      setRegulasi({ ...regulasi, tahun: Number(e.target.value) })
                    }
                    className="w-full rounded-md border border-paper-line bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-muted mb-1">
                    Jenis regulasi
                  </label>
                  <select
                    value={regulasi.jenis}
                    onChange={(e) =>
                      setRegulasi({ ...regulasi, jenis: e.target.value })
                    }
                    className="w-full rounded-md border border-paper-line bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none"
                  >
                    {JENIS_REGULASI.map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-muted mb-1">
                    Kategori
                  </label>
                  <select
                    value={regulasi.kategori}
                    onChange={(e) =>
                      setRegulasi({ ...regulasi, kategori: e.target.value })
                    }
                    className="w-full rounded-md border border-paper-line bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none"
                  >
                    {KATEGORI_REGULASI.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-muted mb-1">
                    Instansi penerbit
                  </label>
                  <input
                    value={regulasi.instansi_penerbit}
                    onChange={(e) =>
                      setRegulasi({
                        ...regulasi,
                        instansi_penerbit: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-paper-line bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-muted mb-1">
                    Status keberlakuan
                  </label>
                  <select
                    value={regulasi.status}
                    onChange={(e) =>
                      setRegulasi({
                        ...regulasi,
                        status: e.target.value as Regulasi["status"],
                      })
                    }
                    className="w-full rounded-md border border-paper-line bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none"
                  >
                    <option value="berlaku">Berlaku</option>
                    <option value="ditinjau">Ditinjau</option>
                    <option value="dicabut">Dicabut</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-muted mb-1">
                  Ringkasan / deskripsi
                </label>
                <textarea
                  rows={3}
                  value={regulasi.deskripsi ?? ""}
                  onChange={(e) =>
                    setRegulasi({ ...regulasi, deskripsi: e.target.value })
                  }
                  className="w-full rounded-md border border-paper-line bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-muted mb-1">
                  Tautan sumber resmi
                </label>
                <input
                  type="url"
                  value={regulasi.link_resmi ?? ""}
                  onChange={(e) =>
                    setRegulasi({ ...regulasi, link_resmi: e.target.value })
                  }
                  className="w-full rounded-md border border-paper-line bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none"
                />
              </div>

              {error && (
                <p className="text-sm text-status-dicabut bg-status-dicabut/10 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex items-center gap-3 pt-2 border-t border-paper-line">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-md bg-ink text-paper-card text-sm font-medium px-4 py-2 hover:bg-ink-light transition-colors disabled:opacity-60"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="text-sm text-slate-muted hover:text-ink"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
