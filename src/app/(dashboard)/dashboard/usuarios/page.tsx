import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ActivateButton } from "./ActivateButton";
import { DeactivateButton } from "./DeactivateButton";

export default async function UsuariosPage() {
  let user;
  try {
    user = await requireAdmin();
  } catch {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Usuarios</h1>
        <Link
          href="/dashboard"
          className="text-sm text-zinc-600 underline hover:text-zinc-900"
        >
          Volver al dashboard
        </Link>
      </div>
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="min-w-full divide-y divide-zinc-200">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-zinc-500">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-zinc-500">
                Correo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-zinc-500">
                Rol
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-zinc-500">
                Estado
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase text-zinc-500">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {users.map((u) => (
              <tr key={u.id} className="bg-white">
                <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-900">
                  {u.fullName}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-600">
                  {u.email}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-600">
                  {u.role}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={`inline rounded px-2 py-0.5 text-xs font-medium ${
                      u.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                  {u.status === "pending" && (
                    <ActivateButton userId={u.id} />
                  )}
                  {u.status === "active" && u.id !== user.id && (
                    <DeactivateButton userId={u.id} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
