import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await getAuthUser();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "NO_AUTH" || msg === "USER_PENDING") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const messages = await prisma.dashboardMessage.findMany({
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      include: { user: { select: { id: true, fullName: true } } },
    });
    return NextResponse.json(messages);
  } catch (e) {
    console.error("GET dashboard-messages", e);
    return NextResponse.json(
      { error: "Error al listar mensajes" },
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
    const content = typeof body.content === "string" ? body.content.trim() : "";
    if (!content || content.length > 2000) {
      return NextResponse.json(
        { error: "El mensaje debe tener entre 1 y 2000 caracteres" },
        { status: 400 }
      );
    }
    const message = await prisma.dashboardMessage.create({
      data: { userId: user.id, content },
      include: { user: { select: { id: true, fullName: true } } },
    });
    return NextResponse.json(message);
  } catch (e) {
    console.error("POST dashboard-messages", e);
    return NextResponse.json(
      { error: "Error al crear mensaje" },
      { status: 500 }
    );
  }
}
