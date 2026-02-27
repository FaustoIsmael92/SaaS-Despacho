import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Lista todos los usuarios (solo administrador). Para gestión y activación.
 */
export async function GET() {
  try {
    await requireAdmin();
  } catch (e) {
    const message = e instanceof Error ? e.message : "Forbidden";
    if (message === "NO_AUTH" || message === "USER_PENDING") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        isActive: true,
        createdAt: true,
      },
    });
    return NextResponse.json(users);
  } catch (e) {
    console.error("list users", e);
    return NextResponse.json(
      { error: "Error al listar usuarios" },
      { status: 500 }
    );
  }
}
