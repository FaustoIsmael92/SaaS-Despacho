import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { createMonthlyActivitySchema } from "@/schemas/task.schema";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const list = await prisma.monthlyActivity.findMany({
      where: { userId: user.id },
      orderBy: { dayOfMonth: "asc" },
    });
    return NextResponse.json(list);
  } catch (e) {
    console.error("GET /api/monthly-activities", e);
    return NextResponse.json(
      { error: "Error al listar actividades mensuales" },
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
    const parsed = createMonthlyActivitySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const activity = await prisma.monthlyActivity.create({
      data: {
        userId: user.id,
        title: parsed.data.title,
        dayOfMonth: parsed.data.dayOfMonth,
      },
    });
    return NextResponse.json(activity);
  } catch (e) {
    console.error("POST /api/monthly-activities", e);
    return NextResponse.json(
      { error: "Error al crear actividad mensual" },
      { status: 500 }
    );
  }
}
