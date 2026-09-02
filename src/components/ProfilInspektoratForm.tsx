"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { inputClassDark, labelClassDark } from "@/lib/form-styles";
import type { ProfilInspektorat } from "@/lib/types";
import {
  Building2,
  Compass,
  Loader2,
  Plus,
  Save,
  ShieldCheck,
  Target,
  Trash2,
} from "lucide-react";

const EMPTY: ProfilInspektorat = {
  id: 1,
  selayang_pandang: "",
  alamat: "",
  telepon: "",
  email: "",
  visi: "",
  misi: [],
  tugas_pokok: [],
  updated_at: "",
};

function ListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className={labelClassDark}>{label}</label>
      <div className="space-y-2">
        {items.map((val, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={val}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              placeholder={placeholder}
              className={inputClassDark}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 text-white/40 hover:text-status-dicabut hover:border-status-dicabut/30 transition-colors"
              aria-label="Hapus item"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan hover:text-cyan/80 transition-colors"
        >
          <Plus size={14} /> Tambah poin
        </button>
      </div>
    </div>
  );
}

export default function ProfilInspektoratForm() {
  const supabase = createClient();
  const [data, setData] = useState<ProfilInspektorat>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: row, error } = await supabase
        .from("profil_inspektorat")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (!error && row) {
        setData({
          ...row,
          misi: row.misi ?? [],
          tugas_pokok: row.tugas_pokok ?? [],
        } as ProfilInspektorat);
      } else if (error) {
        setError(
          "Gagal memuat profil inspektorat. Pastikan skrip supabase/add-profil-inspektorat.sql sudah dijalankan."
        );
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: upsertError } = await supabase.from("profil_inspektorat").upsert({
        id: 1,
        selayang_pandang: data.selayang_pandang || null,
        alamat: data.alamat || null,
        telepon: data.telepon || null,
        email: data.email || null,
        visi: data.visi || null,
        misi: data.misi.filter((m) => m.trim() !== ""),
        tugas_pokok: data.tugas_pokok.filter((t) => t.trim() !== ""),
      });

      if (upsertError) throw upsertError;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan profil inspektorat.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-white/50 py-6">
        <Loader2 size={16} className="animate-spin" /> Memuat data profil...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <section className="surface-card-dark p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-cyan/10 text-cyan">
            <Building2 size={16} />
          </span>
          <h3 className="font-display font-semibold text-sm text-white">
            Identitas & Kontak
          </h3>
        </div>

        <div>
          <label className={labelClassDark}>Selayang pandang</label>
          <textarea
            value={data.selayang_pandang ?? ""}
            onChange={(e) => setData({ ...data, selayang_pandang: e.target.value })}
            rows={4}
            placeholder="Ringkasan tentang Inspektorat..."
            className={inputClassDark}
          />
        </div>

        <div>
          <label className={labelClassDark}>Alamat</label>
          <input
            value={data.alamat ?? ""}
            onChange={(e) => setData({ ...data, alamat: e.target.value })}
            placeholder="Jl. Pemerintahan, Waikabubak, Kabupaten Sumba Barat, NTT"
            className={inputClassDark}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClassDark}>Telepon</label>
            <input
              value={data.telepon ?? ""}
              onChange={(e) => setData({ ...data, telepon: e.target.value })}
              placeholder="(0387) xxx-xxx"
              className={inputClassDark}
            />
          </div>
          <div>
            <label className={labelClassDark}>Email</label>
            <input
              type="email"
              value={data.email ?? ""}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              placeholder="inspektorat@sumbabaratkab.go.id"
              className={inputClassDark}
            />
          </div>
        </div>
      </section>

      <section className="surface-card-dark p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-cyan/10 text-cyan">
            <Compass size={16} />
          </span>
          <h3 className="font-display font-semibold text-sm text-white">Visi</h3>
        </div>
        <textarea
          value={data.visi ?? ""}
          onChange={(e) => setData({ ...data, visi: e.target.value })}
          rows={3}
          placeholder="Terwujudnya pengawasan internal pemerintahan daerah yang..."
          className={inputClassDark}
        />
      </section>

      <section className="surface-card-dark p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-accent/15 text-accent">
            <Target size={16} />
          </span>
          <h3 className="font-display font-semibold text-sm text-white">Misi</h3>
        </div>
        <ListEditor
          label="Poin-poin misi"
          items={data.misi}
          onChange={(misi) => setData({ ...data, misi })}
          placeholder="Contoh: Meningkatkan kualitas pengawasan internal..."
        />
      </section>

      <section className="surface-card-dark p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-cyan/10 text-cyan">
            <ShieldCheck size={16} />
          </span>
          <h3 className="font-display font-semibold text-sm text-white">
            Tugas Pokok & Fungsi
          </h3>
        </div>
        <ListEditor
          label="Poin-poin tugas pokok"
          items={data.tugas_pokok}
          onChange={(tugas_pokok) => setData({ ...data, tugas_pokok })}
          placeholder="Contoh: Melaksanakan pengawasan internal terhadap..."
        />
      </section>

      {error && (
        <p className="text-sm text-status-dicabut bg-status-dicabut/10 border border-status-dicabut/20 rounded-lg px-3 py-2.5">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-status-berlaku bg-status-berlaku/10 border border-status-berlaku/20 rounded-lg px-3 py-2.5">
          Profil inspektorat berhasil disimpan.
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent to-cyan text-white text-sm font-semibold px-5 py-2.5 shadow-glow hover:brightness-110 transition-all disabled:opacity-60"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Menyimpan..." : "Simpan Profil"}
        </button>
      </div>
    </form>
  );
}
