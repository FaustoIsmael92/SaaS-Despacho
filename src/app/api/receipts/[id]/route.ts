import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await getAuthUser();
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const receipt = await prisma.receipt.findUnique({
      where: { id },
      include: {
        client: true,
        items: { include: { concept: true } },
      },
    });
    if (!receipt) {
      return NextResponse.json({ error: "Recibo no encontrado" }, { status: 404 });
    }
    return NextResponse.json(receipt);
  } catch (e) {
    console.error("GET /api/receipts/[id]", e);
    return NextResponse.json(
      { error: "Error al obtener recibo" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await getAuthUser();
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : undefined;
    if (items !== undefined) {
      await prisma.receiptItem.deleteMany({ where: { receiptId: id } });
      let total = 0;
      for (const it of items) {
        const subtotal = Number(it.subtotal ?? it.quantity * it.unitPrice);
        total += subtotal;
        await prisma.receiptItem.create({
          data: {
            receiptId: id,
            conceptId: it.conceptId,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            subtotal,
            description: it.description ?? null,
          },
        });
      }
      await prisma.receipt.update({
        where: { id },
        data: { totalAmount: total },
      });
    }
    const updated = await prisma.receipt.findUnique({
      where: { id },
      include: {
        client: true,
        items: { include: { concept: true } },
      },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("PATCH /api/receipts/[id]", e);
    return NextResponse.json(
      { error: "Error al actualizar recibo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await getAuthUser();
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await prisma.receipt.update({
      where: { id },
      data: { isActive: false },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/receipts/[id]", e);
    return NextResponse.json(
      { error: "Recibo no encontrado" },
      { status: 404 }
    );
  }
}
