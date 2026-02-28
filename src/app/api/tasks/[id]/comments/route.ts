import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { taskService } from "@/modules/tasks/task.service";
import { createCommentSchema } from "@/schemas/task.schema";
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
    const canComment =
      task.assignedToId === user.id ||
      task.createdById === user.id ||
      task.isUrgent;
    if (!canComment) {
      return NextResponse.json(
        { error: "No puede comentar en esta tarea" },
        { status: 403 }
      );
    }
    const body = await request.json();
    const parsed = createCommentSchema.safeParse({ ...body, taskId });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const comment = await taskService.addComment(
      taskId,
      user.id,
      parsed.data.content
    );
    return NextResponse.json(comment);
  } catch (e) {
    console.error("POST /api/tasks/[id]/comments", e);
    return NextResponse.json(
      { error: "Error al crear el comentario" },
      { status: 500 }
    );
  }
}
