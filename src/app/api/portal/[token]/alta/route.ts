import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const p = prisma as any;

const NSS_RE = /^\d{11}$/;
const RFC_RE = /^[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$/i;

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
    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const curp = String(body.curp ?? "").trim().toUpperCase();
    const nss = String(body.nss ?? "").trim();
    const rfc = String(body.rfc ?? "").trim().toUpperCase();
    const postalCode = String(body.postalCode ?? "").trim();
    const hireDateStr = String(body.hireDate ?? "").trim();

    if (!firstName || !lastName || !curp || !nss || !rfc || !postalCode || !hireDateStr) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }
    if (!NSS_RE.test(nss)) {
      return NextResponse.json(
        { error: "El NSS debe tener 11 dígitos numéricos" },
        { status: 400 }
      );
    }
    if (!RFC_RE.test(rfc)) {
      return NextResponse.json(
        { error: "RFC inválido (4 letras + 6 números + 3 alfanuméricos)" },
        { status: 400 }
      );
    }

    const hireDate = new Date(hireDateStr);
    if (Number.isNaN(hireDate.getTime())) {
      return NextResponse.json({ error: "Fecha de alta inválida" }, { status: 400 });
    }

    const employee = await p.employee.create({
      data: {
        clientId: client.id,
        firstName,
        lastName,
        curp,
        nss,
        rfc,
        postalCode,
        hireDate,
        employmentStatus: "activo",
      },
      select: { id: true, firstName: true, lastName: true },
    });

    await p.payrollEvent.create({
      data: {
        clientId: client.id,
        employeeId: employee.id,
        eventType: "alta",
        startDate: hireDate,
        endDate: null,
        notes: null,
      },
    });

    return NextResponse.json({ ok: true, employee });
  } catch (e) {
    console.error("POST /api/portal/[token]/alta", e);
    return NextResponse.json(
      { error: "Error al registrar alta" },
      { status: 500 }
    );
  }
}

