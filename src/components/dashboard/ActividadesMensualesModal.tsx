"use client";

import { useState, useEffect } from "react";

type Activity = {
  id: string;
  title: string;
  dayOfMonth: number;
  isActive: boolean;
};

export function ActividadesMensualesModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetch("/api/monthly-activities")
        .then((r) => r.json())
        .then((data) => setActivities(Array.isArray(data) ? data : []))
        .finally(() => setLoading(false));
    }
  }, [open]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/monthly-activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), dayOfMonth }),
      });
      if (res.ok) {
        const created = await res.json();
        setActivities((prev) => [...prev, created]);
        setTitle("");
        setDayOfMonth(1);
      }
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    await fetch(`/api/monthly-activities/${id}`, { method: "DELETE" });
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg border border-zinc-200 bg-white p-6 shadow dark:border-zinc-700 dark:bg-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Actividades mensuales
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
          >
            Cerrar
          </button>
        </div>
        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          Programa actividades que se repiten el mismo día cada mes. Se generarán automáticamente cada mes.
        </p>
        <form onSubmit={add} className="mb-4 flex flex-wrap gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
            className="rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
            maxLength={200}
          />
          <label className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
            Día:
            <input
              type="number"
              min={1}
              max={31}
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(Number(e.target.value))}
              className="w-14 rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
            />
          </label>
          <button
            type="submit"
            disabled={saving || !title.trim()}
            className="rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Agregar
          </button>
        </form>
        {loading ? (
          <p className="text-sm text-zinc-500">Cargando…</p>
        ) : (
          <ul className="space-y-2">
            {activities.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between rounded border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-700/50"
              >
                <span className="text-zinc-900 dark:text-zinc-100">
                  {a.title} (día {a.dayOfMonth})
                </span>
                <button
                  type="button"
                  onClick={() => remove(a.id)}
                  className="text-sm text-red-600 hover:underline dark:text-red-400"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
        {!loading && activities.length === 0 && (
          <p className="text-sm text-zinc-500">No hay actividades. Agrega una arriba.</p>
        )}
      </div>
    </div>
  );
}
