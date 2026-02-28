import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const p = prisma as any;

async function getClientByToken(token: string) {
  const client = await p.client.findFirst({
    where: { portalToken: token, isActive: true },
    select: { id: true },
  });
  return client as { id: string } | null;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const client = await getClientByToken(token);
    if (!client) {
      return NextResponse.json({ error: "Token inválido" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const employeeId = String(body.employeeId ?? "");
    if (!employeeId) {
      return NextResponse.json({ error: "employeeId requerido" }, { status: 400 });
    }

    const employee = await p.employee.findFirst({
      where: { id: employeeId, clientId: client.id },
      select: { id: true },
    });
    if (!employee) {
      return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });
    }

    await p.employee.update({
      where: { id: employeeId },
      data: { employmentStatus: "activo", terminationDate: null },
    });

    const now = new Date();
    await p.payrollEvent.create({
      data: {
        clientId: client.id,
        employeeId,
        eventType: "alta",
        startDate: now,
        endDate: null,
        notes: "Reactivación",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/portal/[token]/reactivate", e);
    return NextResponse.json(
      { error: "Error al reactivar empleado" },
      { status: 500 }
    );
  }
}

