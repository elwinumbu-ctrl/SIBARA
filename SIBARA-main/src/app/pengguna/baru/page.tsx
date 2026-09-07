import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";
import PageHero from "@/components/PageHero";
import TambahPenggunaForm from "@/components/TambahPenggunaForm";
import { UserPlus } from "lucide-react";

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
    <AppShell active="pengguna" title="Tambah Pengguna" showAddButton={false} dark>
      <PageHero
        icon={UserPlus}
        eyebrow="Manajemen Pengguna"
        title="Tambah Pengguna Baru"
        description="Buat akun baru untuk auditor atau admin utama lainnya. Akun dapat langsung dipakai untuk masuk ke SIBARA."
      />
      <div className="max-w-2xl mx-auto">
        <TambahPenggunaForm dark />
      </div>
    </AppShell>
  );
}
