import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await getAuthUser();
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const { id } = await context.params;
    const body = await request.json();
    const name = body.name != null ? String(body.name).trim() : undefined;
    if (name === undefined) {
      return NextResponse.json({ error: "Nada que actualizar" }, { status: 400 });
    }
    if (name !== undefined && !name) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }
    const concept = await prisma.concept.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json(concept);
  } catch {
    return NextResponse.json(
      { error: "Concepto no encontrado" },
      { status: 404 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await getAuthUser();
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const { id } = await context.params;
    await prisma.concept.update({
      where: { id },
      data: { isActive: false },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Concepto no encontrado" },
      { status: 404 }
    );
  }
}
