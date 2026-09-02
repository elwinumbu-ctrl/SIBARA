"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { friendlyStorageError } from "@/lib/storage-error";
import { Camera, Loader2, User } from "lucide-react";

const BUCKET = "pejabat-photos";
const MAX_SIZE_MB = 5;

function publicUrl(path: string | null) {
  if (!path) return null;
  // Foto bawaan (default) disimpan statis di /public/pejabat dan direferensikan
  // dengan path yang diawali "/", jadi tidak perlu diambil dari Supabase Storage.
  if (path.startsWith("/")) return path;
  const supabase = createClient();
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export default function PejabatFotoEditor({
  id,
  peran,
  nama,
  keterangan,
  urutan,
  fotoPath: initialFotoPath,
}: {
  /** null jika baris ini belum ada di database (masih data bawaan tampilan). */
  id: string | null;
  peran: string;
  nama: string | null;
  keterangan: string | null;
  urutan: number;
  fotoPath: string | null;
}) {
  const supabase = createClient();

  const [rowId, setRowId] = useState(id);
  const [fotoPath, setFotoPath] = useState(initialFotoPath);
  const [previewUrl, setPreviewUrl] = useState<string | null>(publicUrl(initialFotoPath));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | null) {
    if (!file) return;
    setError(null);

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(
        `Ukuran foto ${(file.size / (1024 * 1024)).toFixed(1)} MB melebihi batas maksimal ${MAX_SIZE_MB} MB.`
      );
      return;
    }

    setUploading(true);
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      const ext = file.name.split(".").pop() || "jpg";
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(safeName, file);

      if (uploadError) throw new Error(friendlyStorageError(uploadError, BUCKET));

      const newFotoPath = uploadData.path;
      const oldFotoPath = fotoPath;

      if (rowId) {
        // Baris sudah ada di database → tinggal perbarui foto_path-nya.
        const { error: updateError } = await supabase
          .from("pejabat_struktur")
          .update({ foto_path: newFotoPath })
          .eq("id", rowId);
        if (updateError) throw updateError;
      } else {
        // Baris masih data bawaan (belum tersimpan) → buat baris baru sekalian.
        const { data: inserted, error: insertError } = await supabase
          .from("pejabat_struktur")
          .insert({
            peran,
            nama: nama && nama !== "—" ? nama : null,
            keterangan,
            urutan,
            foto_path: newFotoPath,
          })
          .select()
          .single();
        if (insertError) throw insertError;
        setRowId(inserted.id as string);
      }

      if (oldFotoPath && !oldFotoPath.startsWith("/")) {
        // Hanya hapus dari Storage kalau foto lama memang tersimpan di sana
        // (bukan foto bawaan statis di /public/pejabat).
        await supabase.storage.from(BUCKET).remove([oldFotoPath]);
      }

      setFotoPath(newFotoPath);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mengunggah foto.");
      setPreviewUrl(publicUrl(fotoPath));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="relative shrink-0">
      <label
        className="relative block w-14 h-14 rounded-full overflow-hidden border border-white/15 bg-white/10 cursor-pointer group"
        title="Klik untuk mengunggah/mengganti foto"
      >
        {previewUrl ? (
          <Image src={previewUrl} alt={nama || peran} fill className="object-cover" unoptimized />
        ) : (
          <span className="flex items-center justify-center w-full h-full text-white/30">
            <User size={22} />
          </span>
        )}

        <span className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          {uploading ? (
            <Loader2 size={16} className="text-white animate-spin" />
          ) : (
            <Camera size={16} className="text-white" />
          )}
        </span>

        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          disabled={uploading}
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          className="hidden"
        />
      </label>

      {error && (
        <p className="absolute z-10 top-full left-1/2 -translate-x-1/2 mt-1.5 w-40 text-[11px] leading-snug text-status-dicabut bg-[#0a2348] border border-status-dicabut/30 rounded-lg px-2 py-1.5 shadow-lg">
          {error}
        </p>
      )}
    </div>
  );
}
