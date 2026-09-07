"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { friendlyStorageError } from "@/lib/storage-error";
import { inputClassDark, labelClassDark } from "@/lib/form-styles";
import type { PejabatStruktur } from "@/lib/types";
import { Camera, Loader2, Save, Trash2, User, X } from "lucide-react";

const BUCKET = "pejabat-photos";
const MAX_SIZE_MB = 5;

function publicFotoUrl(path: string | null) {
  if (!path) return null;
  const supabase = createClient();
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export default function PejabatFormCard({
  item,
  isNew = false,
  nextUrutan = 1,
  onSaved,
  onDeleted,
  onCancelNew,
}: {
  item?: PejabatStruktur;
  isNew?: boolean;
  nextUrutan?: number;
  onSaved: (item: PejabatStruktur) => void;
  onDeleted?: (id: string) => void;
  onCancelNew?: () => void;
}) {
  const supabase = createClient();

  const [peran, setPeran] = useState(item?.peran ?? "");
  const [nama, setNama] = useState(item?.nama ?? "");
  const [keterangan, setKeterangan] = useState(item?.keterangan ?? "");
  const [urutan, setUrutan] = useState(item?.urutan ?? nextUrutan);
  const [fotoPath, setFotoPath] = useState<string | null>(item?.foto_path ?? null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(publicFotoUrl(item?.foto_path ?? null));
  const [newFoto, setNewFoto] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handlePickFoto(file: File | null) {
    setNewFoto(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (!peran.trim()) {
      setError("Nama jabatan wajib diisi.");
      return;
    }
    setSaving(true);
    setError(null);

    try {
      let finalFotoPath = fotoPath;
      const oldFotoPath = item?.foto_path ?? null;

      if (newFoto) {
        if (newFoto.size > MAX_SIZE_MB * 1024 * 1024) {
          throw new Error(
            `Ukuran foto ${(newFoto.size / (1024 * 1024)).toFixed(
              1
            )} MB melebihi batas maksimal ${MAX_SIZE_MB} MB. Gunakan foto yang lebih kecil.`
          );
        }
        const ext = newFoto.name.split(".").pop() || "jpg";
        const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(safeName, newFoto);

        if (uploadError) throw new Error(friendlyStorageError(uploadError, BUCKET));
        finalFotoPath = uploadData.path;
      }

      const payload = {
        peran: peran.trim(),
        nama: nama.trim() || null,
        keterangan: keterangan.trim() || null,
        urutan,
        foto_path: finalFotoPath,
      };

      let saved: PejabatStruktur;

      if (isNew) {
        const { data, error: insertError } = await supabase
          .from("pejabat_struktur")
          .insert(payload)
          .select()
          .single();
        if (insertError) throw insertError;
        saved = data as PejabatStruktur;
      } else {
        const { data, error: updateError } = await supabase
          .from("pejabat_struktur")
          .update(payload)
          .eq("id", item!.id)
          .select()
          .single();
        if (updateError) throw updateError;
        saved = data as PejabatStruktur;
      }

      if (newFoto && oldFotoPath) {
        await supabase.storage.from(BUCKET).remove([oldFotoPath]);
      }

      setFotoPath(finalFotoPath);
      setNewFoto(null);
      onSaved(saved);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan data pejabat.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!item || isNew) return;
    if (!confirm(`Hapus data "${item.peran}"? Tindakan ini tidak dapat dibatalkan.`)) return;

    setDeleting(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from("pejabat_struktur")
        .delete()
        .eq("id", item.id);
      if (deleteError) throw deleteError;

      if (item.foto_path) {
        await supabase.storage.from(BUCKET).remove([item.foto_path]);
      }

      onDeleted?.(item.id);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menghapus data pejabat.");
      setDeleting(false);
    }
  }

  return (
    <div className="surface-card-dark p-4 sm:p-5 space-y-4">
      <div className="flex items-start gap-4">
        {/* Foto */}
        <label className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-white/15 bg-white/5 cursor-pointer group">
          {previewUrl ? (
            <Image src={previewUrl} alt={peran || "Foto pejabat"} fill className="object-cover" unoptimized />
          ) : (
            <span className="flex items-center justify-center w-full h-full text-white/30">
              <User size={22} />
            </span>
          )}
          <span className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Camera size={16} className="text-white" />
          </span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => handlePickFoto(e.target.files?.[0] ?? null)}
            className="hidden"
          />
        </label>

        <div className="flex-1 min-w-0 grid sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClassDark}>Jabatan *</label>
            <input
              value={peran}
              onChange={(e) => setPeran(e.target.value)}
              placeholder="Contoh: Inspektur"
              className={inputClassDark}
            />
          </div>
          <div>
            <label className={labelClassDark}>Nama pejabat</label>
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Dr. Nama Pejabat, S.E."
              className={inputClassDark}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClassDark}>Keterangan</label>
            <input
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Contoh: Pimpinan tertinggi Inspektorat"
              className={inputClassDark}
            />
          </div>
          <div>
            <label className={labelClassDark}>Urutan tampil</label>
            <input
              type="number"
              value={urutan}
              onChange={(e) => setUrutan(Number(e.target.value))}
              className={inputClassDark}
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-status-dicabut bg-status-dicabut/10 border border-status-dicabut/20 rounded-lg px-3 py-2.5">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-1 border-t border-white/10">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || deleting}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent to-cyan text-white text-sm font-semibold px-4 py-2 shadow-glow hover:brightness-110 transition-all disabled:opacity-60 mt-3"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Menyimpan..." : isNew ? "Tambah Pejabat" : "Simpan"}
        </button>

        {isNew ? (
          onCancelNew && (
            <button
              type="button"
              onClick={onCancelNew}
              className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white mt-3"
            >
              <X size={14} /> Batal
            </button>
          )
        ) : (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving || deleting}
            className="inline-flex items-center gap-1.5 text-sm text-status-dicabut hover:text-status-dicabut/80 disabled:opacity-60 mt-3"
          >
            {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {deleting ? "Menghapus..." : "Hapus"}
          </button>
        )}
      </div>
    </div>
  );
}
