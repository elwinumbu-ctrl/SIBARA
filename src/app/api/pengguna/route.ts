import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PenggunaListItem } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Memastikan pemanggil sudah login DAN berperan admin di tabel profiles.
 * Dijalankan lewat klien server biasa (bukan admin client) agar memakai
 * sesi login pengguna yang sebenarnya, bukan hak akses penuh service role.
 */
async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      error: NextResponse.json(
        { error: "Anda harus masuk terlebih dahulu." },
        { status: 401 }
      ),
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return {
      user: null,
      error: NextResponse.json(
        {
          error:
            "Hanya admin utama yang dapat mengelola pengguna. Hubungi admin aplikasi Anda.",
        },
        { status: 403 }
      ),
    };
  }

  return { user, error: null };
}

// GET /api/pengguna — daftar seluruh pengguna (khusus admin)
export async function GET() {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const admin = createAdminClient();
    const supabase = createClient();

    const [{ data: authUsers, error: listError }, { data: profiles, error: profileError }] =
      await Promise.all([
        admin.auth.admin.listUsers({ perPage: 1000 }),
        supabase.from("profiles").select("id, nama_lengkap, role, created_at"),
      ]);

    if (listError) throw listError;
    if (profileError) throw profileError;

    const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

    const users: PenggunaListItem[] = (authUsers?.users ?? [])
      .map((u) => {
        const profile = profileMap.get(u.id);
        return {
          id: u.id,
          email: u.email ?? null,
          nama_lengkap: profile?.nama_lengkap ?? null,
          role: (profile?.role as "admin" | "auditor") ?? "auditor",
          created_at: profile?.created_at ?? u.created_at,
        };
      })
      .sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Gagal memuat daftar pengguna." },
      { status: 500 }
    );
  }
}

// POST /api/pengguna — buat akun pengguna baru (khusus admin)
export async function POST(request: Request) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  let body: {
    email?: string;
    password?: string;
    nama_lengkap?: string;
    role?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Data formulir tidak valid." },
      { status: 400 }
    );
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  const namaLengkap = body.nama_lengkap?.trim() || null;
  const role = body.role === "admin" ? "admin" : "auditor";

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Alamat email tidak valid." },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Kata sandi minimal 6 karakter." },
      { status: 400 }
    );
  }

  try {
    const admin = createAdminClient();

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nama_lengkap: namaLengkap, role },
    });

    if (createError) {
      const raw = createError.message || "";
      const message = raw.toLowerCase().includes("already")
        ? "Email tersebut sudah terdaftar sebagai pengguna."
        : raw || "Gagal membuat pengguna baru.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const newUserId = created.user?.id;
    if (newUserId) {
      // Trigger database (on_auth_user_created) seharusnya sudah membuat
      // baris profil otomatis; upsert di sini sebagai jaminan agar nama
      // & peran tetap tersimpan walau trigger belum terpasang.
      const { error: upsertError } = await admin
        .from("profiles")
        .upsert({ id: newUserId, nama_lengkap: namaLengkap, role });
      if (upsertError) throw upsertError;
    }

    return NextResponse.json({ success: true, id: newUserId });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Gagal membuat pengguna baru." },
      { status: 500 }
    );
  }
}
