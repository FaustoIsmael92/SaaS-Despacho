"use client";

import { useState, useEffect } from "react";

type Activity = {
  id: string;
  title: string;
  dayOfMonth: number;
  isActive: boolean;
};

export function MonthlyActivitiesSection() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await fetch("/api/monthly-activities");
    if (res.ok) setActivities(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

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

  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center text-zinc-500">
        Cargando actividades recurrentes…
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6">
      <h2 className="mb-4 font-medium text-zinc-900">
        Actividades mensuales recurrentes
      </h2>
      <p className="mb-4 text-sm text-zinc-500">
        Cada mes se generarán tareas automáticamente según estas plantillas. Si
        el mes no tiene ese día (ej. 31), se usará el último día del mes.
      </p>
      <form onSubmit={add} className="mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título de la actividad"
          className="rounded border border-zinc-300 px-3 py-2 text-sm"
          maxLength={200}
        />
        <label className="flex items-center gap-1 text-sm text-zinc-600">
          Día del mes:
          <input
            type="number"
            min={1}
            max={31}
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(Number(e.target.value))}
            className="w-14 rounded border border-zinc-300 px-2 py-1 text-sm"
          />
        </label>
        <button
          type="submit"
          disabled={saving || !title.trim()}
          className="rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          Agregar
        </button>
      </form>
      <ul className="space-y-2">
        {activities.map((a) => (
          <li
            key={a.id}
            className="flex items-center justify-between rounded border border-zinc-100 bg-zinc-50/50 px-3 py-2"
          >
            <span className="text-zinc-900">
              {a.title} (día {a.dayOfMonth})
            </span>
            <button
              type="button"
              onClick={() => remove(a.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      {activities.length === 0 && (
        <p className="text-sm text-zinc-500">
          No hay actividades recurrentes. Agrega una arriba.
        </p>
      )}
    </div>
  );
}
