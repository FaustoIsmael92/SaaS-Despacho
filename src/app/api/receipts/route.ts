import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    await getAuthUser();
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId") ?? undefined;
    const conceptId = searchParams.get("conceptId") ?? undefined;
    const from = searchParams.get("from") ?? undefined;
    const to = searchParams.get("to") ?? undefined;

    const where: any = { isActive: true };
    if (clientId) where.clientId = clientId;
    if (conceptId) where.items = { some: { conceptId } };
    if (from || to) {
      where.issueDate = {};
      if (from) where.issueDate.gte = new Date(from);
      if (to) {
        const d = new Date(to);
        d.setHours(23, 59, 59, 999);
        where.issueDate.lte = d;
      }
    }

    const receipts = await (prisma as any).receipt.findMany({
      where,
      orderBy: { issueDate: "desc" },
      include: {
        client: { select: { id: true, name: true } },
        items: {
          include: { concept: { select: { id: true, name: true } } },
        },
      },
    });
    return NextResponse.json(receipts);
  } catch (e) {
    console.error("GET /api/receipts", e);
    return NextResponse.json(
      { error: "Error al listar recibos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await getAuthUser();
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const clientId = String(body.clientId ?? "");
    const items = Array.isArray(body.items) ? body.items : [];

    if (!clientId || items.length === 0) {
      return NextResponse.json(
        { error: "Cliente y al menos un concepto son requeridos" },
        { status: 400 }
      );
    }

    const agg = await (prisma as any).receipt.aggregate({ _max: { folio: true } });
    const folio = (agg?._max?.folio ?? 0) + 1;

    const totalAmount = items.reduce(
      (sum: number, i: any) => sum + Number(i.quantity) * Number(i.unitPrice),
      0
    );

    const receipt = await (prisma as any).receipt.create({
      data: {
        clientId,
        folio,
        issueDate: new Date(),
        totalAmount,
        notes: body.notes ?? null,
      },
    });

    for (const it of items) {
      const quantity = Number(it.quantity) || 0;
      const unitPrice = Number(it.unitPrice) || 0;
      const subtotal = quantity * unitPrice;
      await (prisma as any).receiptItem.create({
        data: {
          receiptId: receipt.id,
          conceptId: it.conceptId,
          quantity,
          unitPrice,
          subtotal,
          description: it.description ?? null,
        },
      });
    }

    const created = await (prisma as any).receipt.findUnique({
      where: { id: receipt.id },
      include: {
        client: { select: { id: true, name: true } },
        items: { include: { concept: { select: { id: true, name: true } } } },
      },
    });
    return NextResponse.json(created);
  } catch (e) {
    console.error("POST /api/receipts", e);
    return NextResponse.json(
      { error: "Error al crear recibo" },
      { status: 500 }
    );
  }
}

