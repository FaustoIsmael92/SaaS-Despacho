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
    const now = new Date();
    const year = now.getFullYear();
    const nextMonth = now.getMonth() + 2;
    const month = nextMonth > 12 ? 1 : nextMonth;
    const yearForMonth = nextMonth > 12 ? year + 1 : year;
    const created = await taskService.generateMonthlyTasksForMonth(
      yearForMonth,
      month
    );
    return NextResponse.json({ ok: true, created, year: yearForMonth, month });
  } catch (e) {
    console.error("cron monthly-activities", e);
    return NextResponse.json(
      { error: "Error al generar actividades mensuales" },
      { status: 500 }
    );
  }
}
