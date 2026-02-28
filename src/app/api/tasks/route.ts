import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { taskService, countActiveTasksByUser, isOverSaturationLimit } from "@/modules/tasks/task.service";
import { createTaskSchema } from "@/schemas/task.schema";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const tasks = await taskService.listByUser(user.id, { includeUrgent: true });
    return NextResponse.json(tasks);
  } catch (e) {
    console.error("GET /api/tasks", e);
    return NextResponse.json(
      { error: "Error al listar tareas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const body = await request.json();
    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { title, description, assignedToId, dueDate, isUrgent } = parsed.data;
    const count = await countActiveTasksByUser(assignedToId);
    if (isOverSaturationLimit(count)) {
      return NextResponse.json(
        {
          error: "saturation",
          message: "El usuario asignado tiene muchas tareas activas. ¿Continuar?",
          count,
        },
        { status: 422 }
      );
    }
    const due = dueDate ? new Date(dueDate) : null;
    const task = await taskService.create({
      title,
      description: description ?? null,
      createdById: user.id,
      assignedToId,
      dueDate: due,
      isUrgent,
    });
    return NextResponse.json(task);
  } catch (e) {
    console.error("POST /api/tasks", e);
    return NextResponse.json(
      { error: "Error al crear la tarea" },
      { status: 500 }
    );
  }
}
