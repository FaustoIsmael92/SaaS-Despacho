import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Crea o actualiza la fila en public.users tras el registro en Supabase Auth.
 * Se llama desde el cliente después de signUp. El usuario queda en estado "pending".
 * Acepta opcionalmente accessToken en el body porque las cookies pueden no estar
 * disponibles de inmediato tras signUp en la misma petición.
 */
export async function POST(request: Request) {
  const supabase = await createClient();

  let user: { id: string; email: string | null; user_metadata?: Record<string, unknown> } | null = null;

  try {
    const body = await request.json().catch(() => ({}));
    const accessToken = typeof body.accessToken === "string" ? body.accessToken : null;

    if (accessToken) {
      const { data: { user: u } } = await supabase.auth.getUser(accessToken);
      user = u;
    }
    if (!user) {
      const { data: { user: u } } = await supabase.auth.getUser();
      user = u;
    }
  } catch {
    const { data: { user: u } } = await supabase.auth.getUser();
    user = u;
  }

  if (!user) {
    return NextResponse.json(
      { error: "No autenticado" },
      { status: 401 }
    );
  }

  const fullName =
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.fullName as string) ||
    user.email?.split("@")[0] ||
    "Usuario";

  try {
    await prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email: user.email ?? "",
        fullName,
        role: "user",
        status: "pending",
        isActive: true,
      },
      update: {
        email: user.email ?? undefined,
        fullName,
        updatedAt: new Date(),
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("register-profile", e);
    return NextResponse.json(
      { error: "Error al crear perfil" },
      { status: 500 }
    );
  }
}
