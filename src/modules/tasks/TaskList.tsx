"use client";

import Link from "next/link";
import { ROUTES } from "@/config/constants";

type Task = {
  id: string;
  title: string;
  dueDate: string | null;
  status: string;
  isUrgent: boolean;
  progress: number;
  assignedTo: { fullName: string };
};

export function TaskList({
  tasks,
  onUpdate,
}: {
  tasks: Task[];
  onUpdate: () => void;
}) {
  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }) : "—";

  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-zinc-500">
        No tienes tareas asignadas.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden">
      <ul className="divide-y divide-zinc-100">
        {tasks.map((t) => (
          <li key={t.id} className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-50">
            <Link
              href={ROUTES.TASKS_ID(t.id)}
              className="min-w-0 flex-1"
            >
              <span className="font-medium text-zinc-900">{t.title}</span>
              <span className="ml-2 text-sm text-zinc-500">
                {formatDate(t.dueDate)} · {t.progress}%
              </span>
              {t.isUrgent && (
                <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">
                  Urgente
                </span>
              )}
            </Link>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                t.status === "completed"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-zinc-100 text-zinc-700"
              }`}
            >
              {t.status === "completed" ? "Completada" : "Pendiente"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
