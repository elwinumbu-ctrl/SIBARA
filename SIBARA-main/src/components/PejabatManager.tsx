"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PejabatStruktur } from "@/lib/types";
import PejabatFormCard from "./PejabatFormCard";
import { Loader2, Plus, Users } from "lucide-react";

export default function PejabatManager() {
  const supabase = createClient();
  const [list, setList] = useState<PejabatStruktur[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingNew, setAddingNew] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("pejabat_struktur")
        .select("*")
        .order("urutan", { ascending: true });

      if (error) {
        setLoadError(
          "Gagal memuat data struktur pejabat. Pastikan skrip supabase/add-profil-inspektorat.sql sudah dijalankan."
        );
      } else {
        setList((data ?? []) as PejabatStruktur[]);
      }
      setLoading(false);
    }
    load();
  }, []);

  function handleUpdated(saved: PejabatStruktur) {
    setList((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      const next = exists
        ? prev.map((p) => (p.id === saved.id ? saved : p))
        : [...prev, saved];
      return [...next].sort((a, b) => a.urutan - b.urutan);
    });
    setAddingNew(false);
  }

  function handleDeleted(id: string) {
    setList((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-white/50 py-6">
        <Loader2 size={16} className="animate-spin" /> Memuat data pejabat...
      </div>
    );
  }

  if (loadError) {
    return (
      <p className="text-sm text-status-dicabut bg-status-dicabut/10 border border-status-dicabut/20 rounded-lg px-3 py-2.5">
        {loadError}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-accent/15 text-accent">
            <Users size={16} />
          </span>
          <h3 className="font-display font-semibold text-sm text-white">
            Struktur & Foto Pejabat
          </h3>
        </div>
        {!addingNew && (
          <button
            type="button"
            onClick={() => setAddingNew(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold px-3 py-2 transition-colors"
          >
            <Plus size={14} /> Tambah Pejabat
          </button>
        )}
      </div>

      {list.length === 0 && !addingNew && (
        <p className="text-sm text-white/40">
          Belum ada data pejabat. Klik &ldquo;Tambah Pejabat&rdquo; untuk menambahkan.
        </p>
      )}

      <div className="space-y-3">
        {list.map((p) => (
          <PejabatFormCard key={p.id} item={p} onSaved={handleUpdated} onDeleted={handleDeleted} />
        ))}

        {addingNew && (
          <PejabatFormCard
            isNew
            nextUrutan={list.length + 1}
            onSaved={handleUpdated}
            onCancelNew={() => setAddingNew(false)}
          />
        )}
      </div>
    </div>
  );
}
