import { getAuthUser } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getAuthUser();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">
        Bienvenido, {user?.fullName}
      </h1>
      <p className="mt-2 text-zinc-600">
        Este es tu panel principal. Aquí podrás gestionar tareas, clientes y
        nómina.
      </p>
      {user?.role === "admin" && (
        <div className="mt-6">
          <Link
            href="/dashboard/usuarios"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800"
          >
            Gestionar usuarios
          </Link>
        </div>
      )}
    </div>
  );
}
