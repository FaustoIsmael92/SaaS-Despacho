import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { taskService } from "@/modules/tasks/task.service";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const tasks = await taskService.listUrgent();
    return NextResponse.json(tasks);
  } catch (e) {
    console.error("GET /api/tasks/urgent", e);
    return NextResponse.json(
      { error: "Error al listar urgentes" },
      { status: 500 }
    );
  }
}
