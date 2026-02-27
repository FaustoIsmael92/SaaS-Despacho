import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/registro", "/pendiente"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => p === pathname || (p !== "/" && pathname.startsWith(p + "/"))
  );
}

function isDashboardPath(pathname: string): boolean {
  return pathname.startsWith("/dashboard") || pathname.startsWith("/api/admin");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Actualizar sesión de Supabase (cookies)
  const res = await updateSession(request);

  // Rutas públicas: no comprobar sesión
  if (isPublicPath(pathname)) {
    return res;
  }

  // Dashboard y API admin: comprobar que hay sesión (el detalle de activo/pendiente se hace en layout o API)
  if (isDashboardPath(pathname) || pathname.startsWith("/api/admin")) {
    const sessionCookie = request.cookies.get("sb-auth-token");
    // Supabase SSR usa otro nombre de cookie; comprobamos si hay alguna cookie de Supabase
    const hasSupabaseCookie = request.cookies
      .getAll()
      .some((c) => c.name.startsWith("sb-"));
    if (!hasSupabaseCookie) {
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
