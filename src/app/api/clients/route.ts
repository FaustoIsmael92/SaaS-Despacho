import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const p = prisma as any;

function generatePortalToken(): string {
  const array = new Uint8Array(32);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  }
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

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
    const clients = await p.client.findMany({
      orderBy: { createdAt: "desc" },
      where: { isActive: true },
    });
    return NextResponse.json(clients);
  } catch (e) {
    console.error("GET /api/clients", e);
    return NextResponse.json(
      { error: "Error al listar clientes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const rfc = String(body.rfc ?? "").trim();
    const clavePatronal = body.clavePatronal != null ? String(body.clavePatronal).trim() : null;
    if (!name) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }
    if (!rfc) {
      return NextResponse.json(
        { error: "El RFC es obligatorio" },
        { status: 400 }
      );
    }
    const client = await p.client.create({
      data: {
        name,
        rfc,
        clavePatronal: clavePatronal || undefined,
        portalToken: generatePortalToken(),
      },
    });
    return NextResponse.json(client);
  } catch (e) {
    console.error("POST /api/clients", e);
    return NextResponse.json(
      { error: "Error al crear cliente" },
      { status: 500 }
    );
  }
}
