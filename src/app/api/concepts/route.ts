import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await getAuthUser();
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const list = await prisma.concept.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(list);
  } catch (e) {
    console.error("GET /api/concepts", e);
    return NextResponse.json(
      { error: "Error al listar conceptos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await getAuthUser();
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    if (!name) {
      return NextResponse.json(
        { error: "El nombre del concepto es obligatorio" },
        { status: 400 }
      );
    }
    const existing = await prisma.concept.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un concepto con ese nombre" },
        { status: 400 }
      );
    }
    const concept = await prisma.concept.create({ data: { name } });
    return NextResponse.json(concept);
  } catch (e) {
    console.error("POST /api/concepts", e);
    return NextResponse.json(
      { error: "Error al crear concepto" },
      { status: 500 }
    );
  }
}
