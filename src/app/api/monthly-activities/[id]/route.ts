import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { updateMonthlyActivitySchema } from "@/schemas/task.schema";
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
    const existing = await prisma.monthlyActivity.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json(
        { error: "Actividad no encontrada" },
        { status: 404 }
      );
    }
    const body = await request.json();
    const parsed = updateMonthlyActivitySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const activity = await prisma.monthlyActivity.update({
      where: { id },
      data: {
        ...(parsed.data.title !== undefined && { title: parsed.data.title }),
        ...(parsed.data.dayOfMonth !== undefined && {
          dayOfMonth: parsed.data.dayOfMonth,
        }),
        ...(parsed.data.isActive !== undefined && {
          isActive: parsed.data.isActive,
        }),
      },
    });
    return NextResponse.json(activity);
  } catch (e) {
    console.error("PATCH /api/monthly-activities/[id]", e);
    return NextResponse.json(
      { error: "Error al actualizar actividad" },
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
    const existing = await prisma.monthlyActivity.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json(
        { error: "Actividad no encontrada" },
        { status: 404 }
      );
    }
    await prisma.monthlyActivity.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/monthly-activities/[id]", e);
    return NextResponse.json(
      { error: "Error al eliminar actividad" },
      { status: 500 }
    );
  }
}
