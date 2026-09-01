"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AppShell from "@/components/AppShell";
import PageHero from "@/components/PageHero";
import { JENIS_REGULASI, KATEGORI_REGULASI } from "@/lib/types";
import { friendlyStorageError } from "@/lib/storage-error";
import { inputClassDark, labelClassDark } from "@/lib/form-styles";
import { UploadCloud, FilePlus2 } from "lucide-react";


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
    <AppShell active="regulasi" title="Tambah Regulasi" showAddButton={false} dark>
      <PageHero
        icon={FilePlus2}
        eyebrow="Bank Regulasi"
        title="Tambah Regulasi"
        description="Lengkapi data regulasi agar mudah ditemukan dan dikelola auditor lain."
      />
      <div className="max-w-2xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="surface-card-dark p-5 sm:p-6 space-y-5"
        >
          <div>
            <label className={labelClassDark}>Judul regulasi *</label>
            <input
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder='Contoh: "Petunjuk Teknis Pengelolaan Dana BOS Reguler Tahun 2026"'
              className={inputClassDark}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClassDark}>Nomor regulasi</label>
              <input
                value={nomorRegulasi}
                onChange={(e) => setNomorRegulasi(e.target.value)}
                placeholder="Contoh: Permendikbudristek No. 63 Tahun 2023"
                className={`${inputClassDark} font-mono`}
              />
            </div>
            <div>
              <label className={labelClassDark}>Tahun terbit *</label>
              <input
                type="number"
                required
                min={1945}
                max={2100}
                value={tahun}
                onChange={(e) => setTahun(Number(e.target.value))}
                className={inputClassDark}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClassDark}>Jenis regulasi *</label>
              <select value={jenis} onChange={(e) => setJenis(e.target.value)} className={inputClassDark}>
                {JENIS_REGULASI.map((j) => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClassDark}>Kategori *</label>
              <select value={kategori} onChange={(e) => setKategori(e.target.value)} className={inputClassDark}>
                {KATEGORI_REGULASI.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClassDark}>Instansi penerbit *</label>
              <input
                required
                value={instansi}
                onChange={(e) => setInstansi(e.target.value)}
                placeholder="Contoh: Kemendikbudristek"
                className={inputClassDark}
              />
            </div>
            <div>
              <label className={labelClassDark}>Status keberlakuan *</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClassDark}>
                <option value="berlaku">Berlaku</option>
                <option value="ditinjau">Ditinjau</option>
                <option value="dicabut">Dicabut</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClassDark}>Ringkasan / deskripsi</label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={3}
              placeholder="Ringkasan singkat isi regulasi dan relevansinya dengan audit Dana BOSP..."
              className={inputClassDark}
            />
          </div>

          <div>
            <label className={labelClassDark}>Tautan sumber resmi</label>
            <input
              type="url"
              value={linkResmi}
              onChange={(e) => setLinkResmi(e.target.value)}
              placeholder="https://jdih.kemendikbud.go.id/..."
              className={inputClassDark}
            />
          </div>

          <div>
            <label className={labelClassDark}>Unggah dokumen (PDF)</label>
            <label className="flex items-center gap-3 rounded-lg border border-dashed border-white/15 bg-white/5 px-4 py-4 cursor-pointer hover:border-cyan/50 hover:bg-white/10 transition-colors">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-cyan/10 text-cyan shrink-0">
                <UploadCloud size={17} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-white truncate">
                  {file ? file.name : "Klik untuk memilih file"}
                </span>
                <span className="block text-xs text-white/40">PDF, DOC, atau DOCX — maks. 10 MB</span>
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
            <p className="text-sm text-status-dicabut bg-status-dicabut/10 border border-status-dicabut/20 rounded-lg px-3 py-2.5">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2 border-t border-white/10">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-gradient-to-r from-accent to-cyan text-white text-sm font-semibold px-5 py-2.5 shadow-glow hover:brightness-110 transition-all disabled:opacity-60 mt-4"
            >
              {loading ? "Menyimpan..." : "Simpan Regulasi"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm text-white/50 hover:text-white mt-4"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
