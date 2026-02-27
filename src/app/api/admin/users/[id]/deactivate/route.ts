import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

/**
 * Desactiva un usuario (solo administrador). El admin no puede desactivarse a sí mismo.
 */
export async function PATCH(_request: Request, { params }: Params) {
  let adminUser;
  try {
    adminUser = await requireAdmin();
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

  if (id === adminUser.id) {
    return NextResponse.json(
      { error: "No puedes desactivar tu propia cuenta" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { status: "pending", isActive: false, updatedAt: new Date() },
    });
    return NextResponse.json(user);
  } catch (e) {
    console.error("deactivate user", e);
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 }
    );
  }
}
