"use client";

import { useState, useEffect } from "react";

type Client = {
  id: string;
  name: string;
  rfc: string;
  clavePatronal: string | null;
  createdAt: string;
};

export function ClientesView() {
  const [clients, setClients] = useState<Client[]>([]);
  const [name, setName] = useState("");
  const [rfc, setRfc] = useState("");
  const [clavePatronal, setClavePatronal] = useState("");
  const [saving, setSaving] = useState(false);
  const [editModal, setEditModal] = useState<Client | null>(null);
  const [editName, setEditName] = useState("");
  const [editRfc, setEditRfc] = useState("");
  const [editClave, setEditClave] = useState("");

  const load = () => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then((data) => setClients(Array.isArray(data) ? data : []))
      .catch(() => setClients([]));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rfc.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          rfc: rfc.trim(),
          clavePatronal: clavePatronal.trim() || undefined,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setClients((prev) => [created, ...prev]);
        setName("");
        setRfc("");
        setClavePatronal("");
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Error al guardar");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este cliente?")) return;
    const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
    if (res.ok) setClients((prev) => prev.filter((c) => c.id !== id));
  };

  const openEdit = (c: Client) => {
    setEditModal(c);
    setEditName(c.name);
    setEditRfc(c.rfc);
    setEditClave(c.clavePatronal ?? "");
  };

  const handleEditSave = async () => {
    if (!editModal || !editName.trim() || !editRfc.trim()) return;
    const res = await fetch(`/api/clients/${editModal.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName.trim(),
        rfc: editRfc.trim(),
        clavePatronal: editClave.trim() || undefined,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setClients((prev) =>
        prev.map((c) => (c.id === editModal.id ? updated : c))
      );
      setEditModal(null);
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Error al guardar");
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-end gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Nombre *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-64 rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            RFC *
          </label>
          <input
            type="text"
            value={rfc}
            onChange={(e) => setRfc(e.target.value)}
            required
            className="w-40 rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Clave patronal
          </label>
          <input
            type="text"
            value={clavePatronal}
            onChange={(e) => setClavePatronal(e.target.value)}
            className="w-40 rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Guardar
        </button>
      </form>
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                RFC
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                Clave patronal
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                Eliminar
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {clients.map((c) => (
              <tr
                key={c.id}
                onDoubleClick={() => openEdit(c)}
                className="cursor-pointer bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100">
                  {c.name}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">
                  {c.rfc}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">
                  {c.clavePatronal ?? "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(c.id);
                    }}
                    className="text-sm text-red-600 hover:underline dark:text-red-400"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clients.length === 0 && (
          <p className="py-8 text-center text-sm text-zinc-500">
            No hay clientes. Añade uno arriba.
          </p>
        )}
      </div>
      {editModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setEditModal(null)}
        >
          <div
            className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold dark:text-zinc-100">
              Editar cliente
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium dark:text-zinc-300">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-zinc-300">
                  RFC *
                </label>
                <input
                  type="text"
                  value={editRfc}
                  onChange={(e) => setEditRfc(e.target.value)}
                  className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-zinc-300">
                  Clave patronal
                </label>
                <input
                  type="text"
                  value={editClave}
                  onChange={(e) => setEditClave(e.target.value)}
                  className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditModal(null)}
                className="rounded border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-600 dark:text-zinc-300"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleEditSave}
                className="rounded bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
