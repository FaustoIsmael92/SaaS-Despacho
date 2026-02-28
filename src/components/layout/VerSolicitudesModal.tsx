"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  fullName: string;
  status: string;
  isActive: boolean;
};

export function VerSolicitudesModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (open) fetchUsers();
  }, [open]);

  const pending = users.filter(
    (u) => u.status === "pending" && u.isActive !== false && u.id
  );

  async function handleActivate(userId: string) {
    setActingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/activate`, {
        method: "PATCH",
      });
      if (res.ok) {
        router.refresh();
        fetchUsers();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Error al aceptar");
      }
    } finally {
      setActingId(null);
    }
  }

  async function handleRechazar(userId: string) {
    setActingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/deactivate`, {
        method: "PATCH",
      });
      if (res.ok) {
        router.refresh();
        fetchUsers();
      }
      else {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Error al rechazar");
      }
    } finally {
      setActingId(null);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-4 shadow dark:border-zinc-700 dark:bg-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Ver solicitudes
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
          >
            Cerrar
          </button>
        </div>
        {loading ? (
          <p className="py-4 text-center text-sm text-zinc-500">
            Cargando…
          </p>
        ) : pending.length === 0 ? (
          <p className="py-4 text-center text-sm text-zinc-500">
            No hay solicitudes pendientes.
          </p>
        ) : (
          <ul className="space-y-2">
            {pending.map((u) => (
              <li
                key={u.id}
                className="flex items-center justify-between rounded border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-700/50"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {u.fullName}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {u.email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleActivate(u.id)}
                    disabled={actingId !== null}
                    className="rounded bg-zinc-900 px-2 py-1 text-xs text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
                  >
                    {actingId === u.id ? "…" : "Aceptar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRechazar(u.id)}
                    disabled={actingId !== null}
                    className="rounded border border-zinc-300 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    Rechazar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
