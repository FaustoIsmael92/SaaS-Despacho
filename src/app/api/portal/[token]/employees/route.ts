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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const client = await getClientByToken(token);
    if (!client) {
      return NextResponse.json({ error: "Token inválido" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // "activo" | "baja"

    const where: any = { clientId: client.id, isActive: true };
    if (status === "baja") where.employmentStatus = "baja";
    if (status === "activo") where.employmentStatus = "activo";

    const employees = await p.employee.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: { id: true, firstName: true, lastName: true },
    });
    return NextResponse.json(employees);
  } catch (e) {
    console.error("GET /api/portal/[token]/employees", e);
    return NextResponse.json(
      { error: "Error al listar empleados" },
      { status: 500 }
    );
  }
}

