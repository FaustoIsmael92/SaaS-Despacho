import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
// Forzamos la versión CJS de pdf-lib para evitar problemas de bundling en Next/Turbopack.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib/cjs");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let user: { fullName: string } | null = null;
  try {
    user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
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

    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const page = doc.addPage([400, 500]);
    const { width } = page.getSize();
    let y = 480;

    page.drawText("Recibo", { x: 50, y, size: 18, font });
    y -= 25;
    page.drawText(`Folio: ${receipt.folio}`, { x: 50, y, size: 12, font });
    y -= 18;
    page.drawText(`Fecha: ${receipt.issueDate.toLocaleDateString("es-MX")}`, { x: 50, y, size: 12, font });
    y -= 18;
    page.drawText(`Cliente: ${receipt.client.name}`, { x: 50, y, size: 12, font });
    y -= 25;

    for (const item of receipt.items) {
      page.drawText(`${item.concept.name}: ${Number(item.subtotal).toFixed(2)}`, {
        x: 50,
        y,
        size: 10,
        font,
      });
      y -= 14;
    }
    y -= 10;
    page.drawText(`Total: ${Number(receipt.totalAmount).toFixed(2)}`, {
      x: 50,
      y,
      size: 12,
      font,
    });
    y -= 30;
    page.drawText(`Firma: ${user?.fullName ?? ""}`, { x: 50, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });

    const pdfBytes = await doc.save();
    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=recibo.pdf",
      },
    });
  } catch (e) {
    console.error("GET /api/receipts/[id]/pdf", e);
    return NextResponse.json(
      { error: "Error al generar PDF" },
      { status: 500 }
    );
  }
}
