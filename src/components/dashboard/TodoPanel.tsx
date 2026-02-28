"use client";

import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/config/constants";

type Task = {
  id: string;
  title: string;
  dueDate: string | null;
  status: string;
  progress: number;
  assignedTo: { fullName: string };
};

export function TodoPanel({
  userId,
  tasks,
  onUpdate,
}: {
  userId: string;
  tasks: Task[];
  onUpdate: () => void;
}) {
  const [filter, setFilter] = useState<"all" | "today" | "week">("all");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const filtered = tasks.filter((t) => {
    if (t.status === "completed") return false;
    if (filter === "all") return true;
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate);
    d.setHours(0, 0, 0, 0);
    if (filter === "today") return d.getTime() === today.getTime();
    return d >= today && d <= weekEnd;
  });

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("es-MX", { day: "numeric", month: "short" }) : "—";

  return (
    <div className="flex flex-col p-2">
      <div className="mb-2 flex gap-1">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded px-2 py-1 text-xs ${filter === "all" ? "bg-zinc-200 dark:bg-zinc-600" : "hover:bg-zinc-100 dark:hover:bg-zinc-700"}`}
        >
          Todas
        </button>
        <button
          type="button"
          onClick={() => setFilter("today")}
          className={`rounded px-2 py-1 text-xs ${filter === "today" ? "bg-zinc-200 dark:bg-zinc-600" : "hover:bg-zinc-100 dark:hover:bg-zinc-700"}`}
        >
          Hoy
        </button>
        <button
          type="button"
          onClick={() => setFilter("week")}
          className={`rounded px-2 py-1 text-xs ${filter === "week" ? "bg-zinc-200 dark:bg-zinc-600" : "hover:bg-zinc-100 dark:hover:bg-zinc-700"}`}
        >
          Esta semana
        </button>
      </div>
      <Link
        href={ROUTES.TASKS_NEW}
        className="mb-2 rounded border border-dashed border-zinc-300 py-2 text-center text-sm text-zinc-500 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
      >
        Añadir tarea
      </Link>
      <ul className="space-y-1">
        {filtered.map((t) => (
          <li key={t.id}>
            <Link
              href={ROUTES.TASKS_ID(t.id)}
              className="block rounded border border-zinc-200 px-2 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
            >
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {t.title}
              </span>
              <span className="ml-1 text-xs text-zinc-500">
                {formatDate(t.dueDate)} · {t.progress}%
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && (
        <p className="py-4 text-center text-sm text-zinc-500">
          No hay tareas en esta vista.
        </p>
      )}
    </div>
  );
}
