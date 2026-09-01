"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AppShell from "@/components/AppShell";
import { JENIS_REGULASI, KATEGORI_REGULASI } from "@/lib/types";
import { friendlyStorageError } from "@/lib/storage-error";
import { UploadCloud } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-border bg-surface-muted px-3 py-2.5 text-sm text-ink focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/10 transition-shadow";
const labelClass = "block text-xs font-semibold text-ink-subtle mb-1.5";

export default function TambahRegulasiPage() {
  const router = useRouter();
  const supabase = createClient();

  const [judul, setJudul] = useState("");
  const [nomorRegulasi, setNomorRegulasi] = useState("");
  const [jenis, setJenis] = useState(JENIS_REGULASI[0]);
  const [instansi, setInstansi] = useState("");
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [kategori, setKategori] = useState(KATEGORI_REGULASI[0]);
  const [status, setStatus] = useState("berlaku");
  const [deskripsi, setDeskripsi] = useState("");
  const [linkResmi, setLinkResmi] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let filePath: string | null = null;
      let fileNama: string | null = null;

      if (file) {
        const MAX_SIZE_MB = 10;
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          throw new Error(
            `Ukuran file ${(file.size / (1024 * 1024)).toFixed(
              1
            )} MB melebihi batas maksimal ${MAX_SIZE_MB} MB. Gunakan file yang lebih kecil.`
          );
        }

        const ext = file.name.split(".").pop();
        const safeName = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}.${ext}`;
        const { data: uploadData, error: uploadError } =
          await supabase.storage
            .from("regulasi-files")
            .upload(safeName, file);

        if (uploadError) {
          throw new Error(friendlyStorageError(uploadError));
        }
        filePath = uploadData.path;
        fileNama = file.name;
      }

      const { error: insertError } = await supabase.from("regulasi").insert({
        judul,
        nomor_regulasi: nomorRegulasi || null,
        jenis,
        instansi_penerbit: instansi,
        tahun,
        kategori,
        status,
        deskripsi: deskripsi || null,
        link_resmi: linkResmi || null,
        file_path: filePath,
        file_nama: fileNama,
        dibuat_oleh: user?.id ?? null,
      });

      if (insertError) throw insertError;

      router.push("/regulasi");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan regulasi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell active="regulasi" title="Tambah Regulasi" showAddButton={false}>
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-xl font-bold text-ink mb-1">
          Tambah Regulasi
        </h2>
        <p className="text-sm text-ink-subtle mb-6">
          Lengkapi data regulasi agar mudah ditemukan dan dikelola auditor lain.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white/95 backdrop-blur-sm border border-white/70 rounded-2xl shadow-panel p-5 sm:p-6 space-y-5"
        >
          <div>
            <label className={labelClass}>Judul regulasi *</label>
            <input
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder='Contoh: "Petunjuk Teknis Pengelolaan Dana BOS Reguler Tahun 2026"'
              className={inputClass}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nomor regulasi</label>
              <input
                value={nomorRegulasi}
                onChange={(e) => setNomorRegulasi(e.target.value)}
                placeholder="Contoh: Permendikbudristek No. 63 Tahun 2023"
                className={`${inputClass} font-mono`}
              />
            </div>
            <div>
              <label className={labelClass}>Tahun terbit *</label>
              <input
                type="number"
                required
                min={1945}
                max={2100}
                value={tahun}
                onChange={(e) => setTahun(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Jenis regulasi *</label>
              <select value={jenis} onChange={(e) => setJenis(e.target.value)} className={inputClass}>
                {JENIS_REGULASI.map((j) => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Kategori *</label>
              <select value={kategori} onChange={(e) => setKategori(e.target.value)} className={inputClass}>
                {KATEGORI_REGULASI.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Instansi penerbit *</label>
              <input
                required
                value={instansi}
                onChange={(e) => setInstansi(e.target.value)}
                placeholder="Contoh: Kemendikbudristek"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Status keberlakuan *</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
                <option value="berlaku">Berlaku</option>
                <option value="ditinjau">Ditinjau</option>
                <option value="dicabut">Dicabut</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Ringkasan / deskripsi</label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={3}
              placeholder="Ringkasan singkat isi regulasi dan relevansinya dengan audit Dana BOSP..."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Tautan sumber resmi</label>
            <input
              type="url"
              value={linkResmi}
              onChange={(e) => setLinkResmi(e.target.value)}
              placeholder="https://jdih.kemendikbud.go.id/..."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Unggah dokumen (PDF)</label>
            <label className="flex items-center gap-3 rounded-lg border border-dashed border-border-strong bg-surface-muted px-4 py-4 cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-accent/8 text-accent shrink-0">
                <UploadCloud size={17} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-ink truncate">
                  {file ? file.name : "Klik untuk memilih file"}
                </span>
                <span className="block text-xs text-ink-faint">PDF, DOC, atau DOCX — maks. 10 MB</span>
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </label>
          </div>

          {error && (
            <p className="text-sm text-status-dicabut bg-status-dicabut-bg rounded-lg px-3 py-2.5">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-accent text-white text-sm font-semibold px-5 py-2.5 hover:bg-accent-600 transition-colors disabled:opacity-60 mt-4"
            >
              {loading ? "Menyimpan..." : "Simpan Regulasi"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm text-ink-subtle hover:text-ink mt-4"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
