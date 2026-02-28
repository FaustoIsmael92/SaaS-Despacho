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

export function UrgentSection({
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
        No hay tareas marcadas como urgentes.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/50">
      <div className="border-b border-amber-200 px-4 py-2 font-medium text-amber-900">
        Urgentes (visibles para todos)
      </div>
      <ul className="divide-y divide-amber-100">
        {tasks.map((t) => (
          <li key={t.id}>
            <Link
              href={ROUTES.TASKS_ID(t.id)}
              className="flex items-center justify-between px-4 py-3 hover:bg-amber-100/50"
            >
              <span className="font-medium text-zinc-900">{t.title}</span>
              <span className="text-sm text-zinc-600">
                {t.assignedTo.fullName} · {formatDate(t.dueDate)} · {t.progress}%
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
