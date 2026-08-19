"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import { JENIS_REGULASI, KATEGORI_REGULASI } from "@/lib/types";

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
        const ext = file.name.split(".").pop();
        const safeName = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}.${ext}`;
        const { data: uploadData, error: uploadError } =
          await supabase.storage
            .from("regulasi-files")
            .upload(safeName, file);

        if (uploadError) throw uploadError;
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

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan regulasi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-display text-2xl text-ink mb-1">
          Tambah Regulasi
        </h1>
        <p className="text-sm text-slate-muted mb-6">
          Lengkapi data regulasi agar mudah ditemukan dan dikelola auditor lain.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-paper-card border border-paper-line rounded-lg shadow-card p-6 space-y-5"
        >
          <div>
            <label className="block text-xs font-medium text-slate-muted mb-1">
              Judul regulasi *
            </label>
            <input
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder='Contoh: "Petunjuk Teknis Pengelolaan Dana BOS Reguler Tahun 2026"'
              className="w-full rounded-md border border-paper-line bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-muted mb-1">
                Nomor regulasi
              </label>
              <input
                value={nomorRegulasi}
                onChange={(e) => setNomorRegulasi(e.target.value)}
                placeholder="Contoh: Permendikbudristek No. 63 Tahun 2023"
                className="w-full rounded-md border border-paper-line bg-white px-3 py-2 text-sm font-mono focus:border-ink focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-muted mb-1">
                Tahun terbit *
              </label>
              <input
                type="number"
                required
                min={1945}
                max={2100}
                value={tahun}
                onChange={(e) => setTahun(Number(e.target.value))}
                className="w-full rounded-md border border-paper-line bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-muted mb-1">
                Jenis regulasi *
              </label>
              <select
                value={jenis}
                onChange={(e) => setJenis(e.target.value)}
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
                Kategori *
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
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
                Instansi penerbit *
              </label>
              <input
                required
                value={instansi}
                onChange={(e) => setInstansi(e.target.value)}
                placeholder="Contoh: Kemendikbudristek"
                className="w-full rounded-md border border-paper-line bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-muted mb-1">
                Status keberlakuan *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
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
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={3}
              placeholder="Ringkasan singkat isi regulasi dan relevansinya dengan audit Dana BOSP..."
              className="w-full rounded-md border border-paper-line bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-muted mb-1">
              Tautan sumber resmi
            </label>
            <input
              type="url"
              value={linkResmi}
              onChange={(e) => setLinkResmi(e.target.value)}
              placeholder="https://jdih.kemendikbud.go.id/..."
              className="w-full rounded-md border border-paper-line bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-muted mb-1">
              Unggah dokumen (PDF)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-slate-muted file:mr-3 file:rounded-md file:border-0 file:bg-ink file:text-paper-card file:text-xs file:font-medium file:px-3 file:py-2 file:cursor-pointer"
            />
          </div>

          {error && (
            <p className="text-sm text-status-dicabut bg-status-dicabut/10 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-ink text-paper-card text-sm font-medium px-5 py-2.5 hover:bg-ink-light transition-colors disabled:opacity-60"
            >
              {loading ? "Menyimpan..." : "Simpan Regulasi"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm text-slate-muted hover:text-ink"
            >
              Batal
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
