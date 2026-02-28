import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;
    const body = await request.json();
    const existing = await prisma.dashboardMessage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Mensaje no encontrado" }, { status: 404 });
    }
    if (body.isPinned !== undefined) {
      await prisma.dashboardMessage.update({
        where: { id },
        data: { isPinned: !!body.isPinned },
      });
      const updated = await prisma.dashboardMessage.findUnique({
        where: { id },
        include: { user: { select: { id: true, fullName: true } } },
      });
      return NextResponse.json(updated);
    }
    if (body.content !== undefined && existing.userId === user.id) {
      const content = String(body.content).trim();
      if (!content || content.length > 2000) {
        return NextResponse.json(
          { error: "El mensaje debe tener entre 1 y 2000 caracteres" },
          { status: 400 }
        );
      }
      const updated = await prisma.dashboardMessage.update({
        where: { id },
        data: { content },
        include: { user: { select: { id: true, fullName: true } } },
      });
      return NextResponse.json(updated);
    }
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  } catch (e) {
    console.error("PATCH dashboard-messages", e);
    return NextResponse.json(
      { error: "Error al actualizar mensaje" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;
    const existing = await prisma.dashboardMessage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Mensaje no encontrado" }, { status: 404 });
    }
    if (existing.userId !== user.id) {
      return NextResponse.json(
        { error: "Solo el autor puede eliminar el mensaje" },
        { status: 403 }
      );
    }
    await prisma.dashboardMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE dashboard-messages", e);
    return NextResponse.json(
      { error: "Error al eliminar mensaje" },
      { status: 500 }
    );
  }
}
