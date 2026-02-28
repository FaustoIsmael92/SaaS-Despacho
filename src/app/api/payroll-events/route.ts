import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const p = prisma as any;

export async function GET(request: Request) {
  try {
    await getAuthUser();
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId") ?? undefined;
    const eventType = searchParams.get("eventType") ?? undefined;
    const from = searchParams.get("from") ?? undefined;
    const to = searchParams.get("to") ?? undefined;

    const where: any = {};
    if (clientId) where.clientId = clientId;
    if (eventType) where.eventType = eventType;
    if (from || to) {
      where.startDate = {};
      if (from) where.startDate.gte = new Date(from);
      if (to) {
        const d = new Date(to);
        d.setHours(23, 59, 59, 999);
        where.startDate.lte = d;
      }
    }

    const events = await p.payrollEvent.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        employee: { select: { firstName: true, lastName: true } },
        client: { select: { name: true } },
      },
    });
    return NextResponse.json(events);
  } catch (e) {
    console.error("GET /api/payroll-events", e);
    return NextResponse.json(
      { error: "Error al listar registros" },
      { status: 500 }
    );
  }
}
