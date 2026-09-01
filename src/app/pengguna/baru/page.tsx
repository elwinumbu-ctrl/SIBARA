import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import TambahPenggunaForm from "@/components/TambahPenggunaForm";

export const dynamic = "force-dynamic";

export default async function TambahPenggunaPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/pengguna");
  }

  return (
    <AppShell active="pengguna" title="Tambah Pengguna" showAddButton={false}>
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-xl font-bold text-ink mb-1">
          Tambah Pengguna
        </h2>
        <p className="text-sm text-ink-subtle mb-6">
          Buat akun baru untuk auditor atau admin utama lainnya. Akun dapat
          langsung dipakai untuk masuk ke SIBARA.
        </p>

        <TambahPenggunaForm />
      </div>
    </AppShell>
  );
}
