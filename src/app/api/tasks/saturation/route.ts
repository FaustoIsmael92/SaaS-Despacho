import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import {
  countActiveTasksByUser,
  isOverSaturationLimit,
} from "@/modules/tasks/task.service";

export async function GET(request: Request) {
  try {
    await getAuthUser();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "Falta userId" },
        { status: 400 }
      );
    }
    const count = await countActiveTasksByUser(userId);
    return NextResponse.json({
      count,
      limitExceeded: isOverSaturationLimit(count),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "NO_AUTH" || msg === "USER_PENDING") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    console.error("GET /api/tasks/saturation", e);
    return NextResponse.json(
      { error: "Error al consultar saturación" },
      { status: 500 }
    );
  }
}
