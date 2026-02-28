import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { taskService, countActiveTasksByUser, isOverSaturationLimit } from "@/modules/tasks/task.service";
import { updateTaskSchema } from "@/schemas/task.schema";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;
    const task = await taskService.getById(id);
    if (!task) {
      return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
    }
    const canView =
      task.assignedToId === user.id ||
      task.createdById === user.id ||
      task.isUrgent;
    if (!canView) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }
    return NextResponse.json(task);
  } catch (e) {
    console.error("GET /api/tasks/[id]", e);
    return NextResponse.json(
      { error: "Error al obtener la tarea" },
      { status: 500 }
    );
  }
}

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
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
    }
    const canEdit =
      existing.assignedToId === user.id || existing.createdById === user.id;
    if (!canEdit) {
      return NextResponse.json({ error: "No puede editar esta tarea" }, { status: 403 });
    }
    const body = await request.json();
    const parsed = updateTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;
    if (data.assignedToId && data.assignedToId !== existing.assignedToId) {
      const count = await countActiveTasksByUser(data.assignedToId);
      if (isOverSaturationLimit(count)) {
        return NextResponse.json(
          {
            error: "saturation",
            message: "El usuario asignado tiene muchas tareas activas.",
            count,
          },
          { status: 422 }
        );
      }
    }
    const due =
      data.dueDate !== undefined
        ? data.dueDate === null || data.dueDate === ""
          ? null
          : new Date(data.dueDate as string)
        : undefined;
    const task = await taskService.update(id, {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.assignedToId !== undefined && { assignedToId: data.assignedToId }),
      ...(due !== undefined && { dueDate: due }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.isUrgent !== undefined && { isUrgent: data.isUrgent }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    });
    return NextResponse.json(task);
  } catch (e) {
    console.error("PATCH /api/tasks/[id]", e);
    return NextResponse.json(
      { error: "Error al actualizar la tarea" },
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
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
    }
    if (existing.createdById !== user.id) {
      return NextResponse.json(
        { error: "Solo el creador puede eliminar la tarea" },
        { status: 403 }
      );
    }
    await prisma.task.update({
      where: { id },
      data: { isActive: false },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/tasks/[id]", e);
    return NextResponse.json(
      { error: "Error al eliminar la tarea" },
      { status: 500 }
    );
  }
}
