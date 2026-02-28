"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/constants";

type UserOption = { id: string; fullName: string };

export function TaskForm({
  createdById,
  initialData,
  taskId,
}: {
  createdById: string;
  initialData?: {
    title: string;
    description: string | null;
    assignedToId: string;
    dueDate: string | null;
    isUrgent: boolean;
  };
  taskId?: string;
}) {
  const router = useRouter();
  const [users, setUsers] = useState<UserOption[]>([]);
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [assignedToId, setAssignedToId] = useState(
    initialData?.assignedToId ?? ""
  );
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().slice(0, 10)
      : ""
  );
  const [isUrgent, setIsUrgent] = useState(initialData?.isUrgent ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/users/options")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
        else setUsers(data.users ?? []);
      })
      .catch(() => setUsers([]));
  }, []);

  useEffect(() => {
    if (users.length && !assignedToId) setAssignedToId(createdById);
  }, [users, assignedToId, createdById]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        assignedToId,
        dueDate: dueDate || null,
        isUrgent,
      };
      const url = taskId ? `/api/tasks/${taskId}` : "/api/tasks";
      const method = taskId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data.error === "saturation"
            ? data.message ?? "El usuario asignado tiene muchas tareas activas."
            : data.error ?? "Error al guardar"
        );
        setSaving(false);
        return;
      }
      const id = data.id ?? taskId;
      if (id) router.push(ROUTES.TASKS_ID(id));
      else router.push(ROUTES.TASKS);
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4 rounded-lg border border-zinc-200 bg-white p-6">
      {error && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-zinc-700">
          Título *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
          className="w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900"
        />
      </div>
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-zinc-700">
          Descripción
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900"
        />
      </div>
      <div>
        <label htmlFor="assignedTo" className="mb-1 block text-sm font-medium text-zinc-700">
          Asignar a *
        </label>
        <select
          id="assignedTo"
          value={assignedToId}
          onChange={(e) => setAssignedToId(e.target.value)}
          required
          className="w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900"
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.fullName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="dueDate" className="mb-1 block text-sm font-medium text-zinc-700">
          Fecha límite
        </label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="isUrgent"
          type="checkbox"
          checked={isUrgent}
          onChange={(e) => setIsUrgent(e.target.checked)}
          className="rounded border-zinc-300"
        />
        <label htmlFor="isUrgent" className="text-sm text-zinc-700">
          Marcar como urgente (visible para todos)
        </label>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {saving ? "Guardando…" : taskId ? "Guardar cambios" : "Crear tarea"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
