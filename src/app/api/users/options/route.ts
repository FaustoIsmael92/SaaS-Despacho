import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Lista mínima de usuarios activos para asignar tareas. */
export async function GET() {
  try {
    await getAuthUser();
    const users = await prisma.user.findMany({
      where: { status: "active", isActive: true },
      select: { id: true, fullName: true },
      orderBy: { fullName: "asc" },
    });
    return NextResponse.json(users);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "NO_AUTH" || msg === "USER_PENDING") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    console.error("GET /api/users/options", e);
    return NextResponse.json(
      { error: "Error al listar usuarios" },
      { status: 500 }
    );
  }
}
