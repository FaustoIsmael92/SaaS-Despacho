import { NextResponse } from "next/server";
import { taskService } from "@/modules/tasks/task.service";

const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "");
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const count = await taskService.rescheduleOverdue();
    return NextResponse.json({ ok: true, rescheduled: count });
  } catch (e) {
    console.error("cron reschedule", e);
    return NextResponse.json(
      { error: "Error al reprogramar tareas" },
      { status: 500 }
    );
  }
}
