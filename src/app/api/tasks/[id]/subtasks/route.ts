import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { taskService } from "@/modules/tasks/task.service";
import { createSubtaskSchema } from "@/schemas/task.schema";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id: taskId } = await params;
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
    }
    const canEdit =
      task.assignedToId === user.id || task.createdById === user.id;
    if (!canEdit) {
      return NextResponse.json(
        { error: "No puede agregar subtareas a esta tarea" },
        { status: 403 }
      );
    }
    const body = await request.json();
    const parsed = createSubtaskSchema.safeParse({ ...body, taskId });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const subtask = await taskService.addSubtask(taskId, parsed.data.title);
    return NextResponse.json(subtask);
  } catch (e) {
    console.error("POST /api/tasks/[id]/subtasks", e);
    return NextResponse.json(
      { error: "Error al crear la subtarea" },
      { status: 500 }
    );
  }
}
