import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

/**
 * Activa un usuario (solo administrador).
 */
export async function PATCH(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
  } catch (e) {
    const message = e instanceof Error ? e.message : "Forbidden";
    if (message === "NO_AUTH" || message === "USER_PENDING") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { status: "active", isActive: true, updatedAt: new Date() },
    });
    return NextResponse.json(user);
  } catch (e) {
    console.error("activate user", e);
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 }
    );
  }
}
