import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const p = prisma as any;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    const client = await p.client.findUnique({ where: { id } });
    if (!client) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }
    return NextResponse.json(client);
  } catch (e) {
    console.error("GET /api/clients/[id]", e);
    return NextResponse.json(
      { error: "Error al obtener cliente" },
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
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "NO_AUTH" || msg === "USER_PENDING") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await request.json();
    const name = body.name != null ? String(body.name).trim() : undefined;
    const rfc = body.rfc != null ? String(body.rfc).trim() : undefined;
    const clavePatronal = body.clavePatronal != null ? String(body.clavePatronal).trim() : undefined;
    if (name !== undefined && !name) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }
    if (rfc !== undefined && !rfc) {
      return NextResponse.json(
        { error: "El RFC es obligatorio" },
        { status: 400 }
      );
    }
    const client = await p.client.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(rfc !== undefined && { rfc }),
        ...(clavePatronal !== undefined && { clavePatronal }),
      },
    });
    return NextResponse.json(client);
  } catch (e) {
    console.error("PATCH /api/clients/[id]", e);
    return NextResponse.json(
      { error: "Cliente no encontrado o datos inválidos" },
      { status: 404 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    await p.client.update({
      where: { id },
      data: { isActive: false },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/clients/[id]", e);
    return NextResponse.json(
      { error: "Cliente no encontrado" },
      { status: 404 }
    );
  }
}
