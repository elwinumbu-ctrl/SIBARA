"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AppShell from "@/components/AppShell";
import PageHero from "@/components/PageHero";
import StatusBadge from "@/components/StatusBadge";
import { JENIS_REGULASI, KATEGORI_REGULASI, Regulasi } from "@/lib/types";
import { friendlyStorageError } from "@/lib/storage-error";
import { inputClassDark, labelClassDark } from "@/lib/form-styles";
import {
  ArrowLeft,
  Building2,
  ExternalLink,
  FileDown,
  FileText,
  Loader2,
  Pencil,
  Tag,
  Trash2,
  UploadCloud,
} from "lucide-react";


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
  const [newFile, setNewFile] = useState<File | null>(null);

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

    try {
      let filePath = regulasi.file_path;
      let fileNama = regulasi.file_nama;
      const oldFilePath = regulasi.file_path;

      if (newFile) {
        const MAX_SIZE_MB = 10;
        if (newFile.size > MAX_SIZE_MB * 1024 * 1024) {
          throw new Error(
            `Ukuran file ${(newFile.size / (1024 * 1024)).toFixed(
              1
            )} MB melebihi batas maksimal ${MAX_SIZE_MB} MB. Gunakan file yang lebih kecil.`
          );
        }

        const ext = newFile.name.split(".").pop();
        const safeName = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}.${ext}`;
        const { data: uploadData, error: uploadError } =
          await supabase.storage
            .from("regulasi-files")
            .upload(safeName, newFile);

        if (uploadError) {
          throw new Error(friendlyStorageError(uploadError));
        }
        filePath = uploadData.path;
        fileNama = newFile.name;
      }

      const { error: updateError } = await supabase
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
          file_path: filePath,
          file_nama: fileNama,
        })
        .eq("id", regulasi.id);

      if (updateError) throw updateError;

      if (newFile && oldFilePath) {
        await supabase.storage.from("regulasi-files").remove([oldFilePath]);
      }

      setRegulasi({ ...regulasi, file_path: filePath, file_nama: fileNama });
      if (filePath) {
        const { data: pub } = supabase.storage
          .from("regulasi-files")
          .getPublicUrl(filePath);
        setFileUrl(pub.publicUrl);
      }

      setNewFile(null);
      setEditing(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!regulasi) return;
    const confirmed = window.confirm(
      `Hapus regulasi "${regulasi.judul}"? Tindakan ini tidak dapat dibatalkan.`
    );
    if (!confirmed) return;

    if (regulasi.file_path) {
      try {
        await supabase.storage
          .from("regulasi-files")
          .remove([regulasi.file_path]);
      } catch {
        // diabaikan, lanjutkan menghapus data
      }
    }
    const { error } = await supabase
      .from("regulasi")
      .delete()
      .eq("id", regulasi.id);

    if (error) {
      setError(error.message);
      return;
    }
    router.push("/regulasi");
    router.refresh();
  }

  if (loading) {
    return (
      <AppShell active="regulasi" title="Detail Regulasi" showAddButton={false} dark>
        <div className="flex items-center justify-center gap-2 py-24 text-sm text-white/50">
          <Loader2 size={16} className="animate-spin" />
          Memuat data regulasi...
        </div>
      </AppShell>
    );
  }

  if (error && !regulasi) {
    return (
      <AppShell active="regulasi" title="Detail Regulasi" showAddButton={false} dark>
        <div className="max-w-2xl mx-auto text-center py-16">
          <p className="text-sm text-status-dicabut bg-status-dicabut/10 border border-status-dicabut/20 inline-block rounded-lg px-4 py-2.5">
            {error}
          </p>
        </div>
      </AppShell>
    );
  }

  if (!regulasi) return null;

  return (
    <AppShell active="regulasi" title="Detail Regulasi" showAddButton={false} dark>
      <PageHero
        icon={FileText}
        eyebrow="Bank Regulasi"
        title={editing ? "Ubah Data Regulasi" : "Detail Regulasi"}
        description={editing ? undefined : regulasi.judul}
      />
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push("/regulasi")}
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white mb-4"
        >
          <ArrowLeft size={15} />
          Kembali ke daftar
        </button>

        <div className="surface-card-dark p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <span className="font-mono text-xs text-white/40">
              {regulasi.nomor_regulasi || "Tanpa nomor"} · {regulasi.tahun}
            </span>
            <StatusBadge status={regulasi.status} dark />
          </div>

          {!editing ? (
            <>
              <h1 className="font-display text-xl font-bold text-white mb-3">
                {regulasi.judul}
              </h1>

              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/55 mb-4">
                <span className="flex items-center gap-1.5">
                  <FileDown size={14} className="text-white/40" />
                  <strong className="text-white font-medium">Jenis:</strong> {regulasi.jenis}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 size={14} className="text-white/40" />
                  <strong className="text-white font-medium">Instansi:</strong> {regulasi.instansi_penerbit}
                </span>
                <span className="flex items-center gap-1.5">
                  <Tag size={14} className="text-white/40" />
                  <strong className="text-white font-medium">Kategori:</strong> {regulasi.kategori}
                </span>
              </div>

              {regulasi.deskripsi && (
                <p className="text-sm text-white/70 leading-relaxed border-t border-white/10 pt-4 mb-4">
                  {regulasi.deskripsi}
                </p>
              )}

              <div className="flex flex-wrap gap-3 mb-5">
                {regulasi.link_resmi && (
                  <a
                    href={regulasi.link_resmi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-cyan font-medium hover:brightness-110"
                  >
                    Buka sumber resmi <ExternalLink size={13} />
                  </a>
                )}
                {fileUrl && (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-cyan font-medium hover:brightness-110 bg-cyan/10 rounded-lg px-3 py-1.5"
                  >
                    <FileDown size={14} /> Unduh {regulasi.file_nama || "dokumen"}
                  </a>
                )}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    setNewFile(null);
                    setEditing(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent to-cyan text-white text-sm font-semibold px-4 py-2.5 shadow-glow hover:brightness-110 transition-all"
                >
                  <Pencil size={14} />
                  Ubah Data
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 text-sm text-status-dicabut hover:bg-status-dicabut/10 rounded-lg px-3 py-2.5 transition-colors"
                >
                  <Trash2 size={14} />
                  Hapus regulasi
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className={labelClassDark}>Judul regulasi</label>
                <input
                  value={regulasi.judul}
                  onChange={(e) => setRegulasi({ ...regulasi, judul: e.target.value })}
                  className={inputClassDark}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClassDark}>Nomor regulasi</label>
                  <input
                    value={regulasi.nomor_regulasi ?? ""}
                    onChange={(e) => setRegulasi({ ...regulasi, nomor_regulasi: e.target.value })}
                    className={`${inputClassDark} font-mono`}
                  />
                </div>
                <div>
                  <label className={labelClassDark}>Tahun terbit</label>
                  <input
                    type="number"
                    value={regulasi.tahun}
                    onChange={(e) => setRegulasi({ ...regulasi, tahun: Number(e.target.value) })}
                    className={inputClassDark}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClassDark}>Jenis regulasi</label>
                  <select
                    value={regulasi.jenis}
                    onChange={(e) => setRegulasi({ ...regulasi, jenis: e.target.value })}
                    className={inputClassDark}
                  >
                    {JENIS_REGULASI.map((j) => (
                      <option key={j} value={j}>{j}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClassDark}>Kategori</label>
                  <select
                    value={regulasi.kategori}
                    onChange={(e) => setRegulasi({ ...regulasi, kategori: e.target.value })}
                    className={inputClassDark}
                  >
                    {KATEGORI_REGULASI.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClassDark}>Instansi penerbit</label>
                  <input
                    value={regulasi.instansi_penerbit}
                    onChange={(e) => setRegulasi({ ...regulasi, instansi_penerbit: e.target.value })}
                    className={inputClassDark}
                  />
                </div>
                <div>
                  <label className={labelClassDark}>Status keberlakuan</label>
                  <select
                    value={regulasi.status}
                    onChange={(e) =>
                      setRegulasi({ ...regulasi, status: e.target.value as Regulasi["status"] })
                    }
                    className={inputClassDark}
                  >
                    <option value="berlaku">Berlaku</option>
                    <option value="ditinjau">Ditinjau</option>
                    <option value="dicabut">Dicabut</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClassDark}>Ringkasan / deskripsi</label>
                <textarea
                  rows={3}
                  value={regulasi.deskripsi ?? ""}
                  onChange={(e) => setRegulasi({ ...regulasi, deskripsi: e.target.value })}
                  className={inputClassDark}
                />
              </div>

              <div>
                <label className={labelClassDark}>Tautan sumber resmi</label>
                <input
                  type="url"
                  value={regulasi.link_resmi ?? ""}
                  onChange={(e) => setRegulasi({ ...regulasi, link_resmi: e.target.value })}
                  className={inputClassDark}
                />
              </div>

              <div>
                <label className={labelClassDark}>Dokumen (PDF/Word)</label>
                {regulasi.file_nama && !newFile && (
                  <p className="flex items-center gap-1.5 text-xs text-white/50 mb-2">
                    <FileDown size={12} /> Saat ini: {regulasi.file_nama}
                  </p>
                )}
                <label className="flex items-center gap-3 rounded-lg border border-dashed border-white/15 bg-white/5 px-4 py-3.5 cursor-pointer hover:border-cyan/50 hover:bg-white/10 transition-colors">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-cyan/10 text-cyan shrink-0">
                    <UploadCloud size={16} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-white truncate">
                      {newFile ? newFile.name : "Klik untuk mengganti dokumen"}
                    </span>
                    <span className="block text-xs text-white/40">
                      Kosongkan jika tidak ingin mengganti dokumen yang sudah ada.
                    </span>
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setNewFile(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                </label>
              </div>

              {error && (
                <p className="text-sm text-status-dicabut bg-status-dicabut/10 border border-status-dicabut/20 rounded-lg px-3 py-2.5">
                  {error}
                </p>
              )}

              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-gradient-to-r from-accent to-cyan text-white text-sm font-semibold px-5 py-2.5 shadow-glow hover:brightness-110 transition-all disabled:opacity-60 mt-4"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
                <button
                  onClick={() => {
                    setNewFile(null);
                    setEditing(false);
                    setError(null);
                  }}
                  className="text-sm text-white/50 hover:text-white mt-4"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
