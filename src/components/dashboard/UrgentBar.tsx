"use client";

import Link from "next/link";
import { ROUTES } from "@/config/constants";

type Task = {
  id: string;
  title: string;
  dueDate: string | null;
  isUrgent: boolean;
  assignedTo: { fullName: string };
};

export function UrgentBar({
  tasks,
  onUpdate,
}: {
  tasks: Task[];
  onUpdate: () => void;
}) {
  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("es-MX", { day: "numeric", month: "short" }) : "—";

  function daysLeft(d: string | null): string {
    if (!d) return "—";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(d);
    due.setHours(0, 0, 0, 0);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return "Vencido";
    if (diff === 0) return "Hoy";
    if (diff === 1) return "1 día";
    return `${diff} días`;
  }

  return (
    <div className="border-t border-zinc-200 bg-amber-50 dark:border-zinc-700 dark:bg-amber-950/30">
      <div className="flex items-center gap-4 px-4 py-2">
        <span className="text-sm font-medium text-amber-900 dark:text-amber-200">
          Urgentes
        </span>
        <Link
          href={ROUTES.TASKS_NEW}
          className="rounded bg-amber-600 px-3 py-1 text-xs font-medium text-white hover:bg-amber-700"
        >
          Añadir
        </Link>
        <div className="flex flex-1 gap-4 overflow-x-auto">
          {tasks.map((t) => (
            <Link
              key={t.id}
              href={ROUTES.TASKS_ID(t.id)}
              className="flex shrink-0 items-center gap-2 rounded border border-amber-200 bg-white px-3 py-1.5 text-sm dark:border-amber-800 dark:bg-amber-900/30"
            >
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {t.title}
              </span>
              <span className="text-xs text-zinc-500">
                {formatDate(t.dueDate)} · {daysLeft(t.dueDate)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
