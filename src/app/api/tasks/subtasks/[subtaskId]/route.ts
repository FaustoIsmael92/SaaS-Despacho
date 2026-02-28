import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { taskService } from "@/modules/tasks/task.service";
import { updateSubtaskSchema } from "@/schemas/task.schema";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ subtaskId: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { subtaskId } = await params;
    const subtask = await prisma.subtask.findUnique({
      where: { id: subtaskId },
      include: { task: true },
    });
    if (!subtask) {
      return NextResponse.json({ error: "Subtarea no encontrada" }, { status: 404 });
    }
    const canEdit =
      subtask.task.assignedToId === user.id ||
      subtask.task.createdById === user.id;
    if (!canEdit) {
      return NextResponse.json(
        { error: "No puede editar esta subtarea" },
        { status: 403 }
      );
    }
    const body = await request.json();
    const parsed = updateSubtaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const updated = await taskService.updateSubtask(subtaskId, {
      ...(parsed.data.title !== undefined && { title: parsed.data.title }),
      ...(parsed.data.isCompleted !== undefined && {
        isCompleted: parsed.data.isCompleted,
      }),
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("PATCH /api/tasks/subtasks/[subtaskId]", e);
    return NextResponse.json(
      { error: "Error al actualizar la subtarea" },
      { status: 500 }
    );
  }
}
