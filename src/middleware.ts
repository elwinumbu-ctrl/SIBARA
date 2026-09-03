import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { GUEST_BLOCKED_PREFIXES } from "@/lib/nav";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthRoute = request.nextUrl.pathname.startsWith("/login");
  const PROTECTED_PREFIXES = [
    "/dashboard",
    "/profil-inspektorat",
    "/regulasi",
    "/kategori",
    "/tahun",
    "/status",
    "/dokumen",
    "/laporan",
    "/rekapitulasi",
    "/pengguna",
    "/pengaturan",
  ];
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix)
  );

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Sesi pengunjung (anonymous sign-in) hanya boleh melihat, tidak boleh
  // membuka menu Pengguna, Pengaturan, atau Tambah Regulasi.
  const isGuest = Boolean(user?.is_anonymous);
  const isGuestBlockedRoute = GUEST_BLOCKED_PREFIXES.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix)
  );
  if (isGuest && isGuestBlockedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
