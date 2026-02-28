"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ROUTES } from "@/config/constants";

type Task = {
  id: string;
  title: string;
  dueDate: string | null;
  status: string;
  isUrgent: boolean;
  assignedTo: { fullName: string };
};

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function TaskCalendar({
  tasks,
  onUpdate,
}: {
  tasks: Task[];
  onUpdate: () => void;
}) {
  const [cursor, setCursor] = useState(() => {
    const n = new Date();
    return { year: n.getFullYear(), month: n.getMonth() };
  });

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const t of tasks) {
      if (!t.dueDate) continue;
      const d = new Date(t.dueDate);
      const key = dateKey(d);
      if (!map[key]) map[key] = [];
      map[key].push(t);
    }
    return map;
  }, [tasks]);

  const { firstDay, daysInMonth, prefixDays } = useMemo(() => {
    const y = cursor.year;
    const m = cursor.month;
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const firstDay = first.getDay();
    const daysInMonth = last.getDate();
    const prefixDays = firstDay === 0 ? 6 : firstDay - 1;
    return { firstDay, daysInMonth, prefixDays };
  }, [cursor]);

  const prev = () => {
    if (cursor.month === 0) setCursor({ year: cursor.year - 1, month: 11 });
    else setCursor({ year: cursor.year, month: cursor.month - 1 });
  };
  const next = () => {
    if (cursor.month === 11) setCursor({ year: cursor.year + 1, month: 0 });
    else setCursor({ year: cursor.year, month: cursor.month + 1 });
  };

  const dayCells = [];
  for (let i = 0; i < prefixDays; i++) {
    dayCells.push(<div key={`p-${i}`} className="min-h-[80px] rounded bg-zinc-100/50 p-1" />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${cursor.year}-${String(cursor.month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dayTasks = tasksByDate[key] ?? [];
    dayCells.push(
      <div
        key={key}
        className="min-h-[80px] rounded border border-zinc-200 bg-white p-1"
      >
        <div className="text-right text-sm font-medium text-zinc-600">{d}</div>
        <ul className="mt-1 space-y-0.5">
          {dayTasks.slice(0, 3).map((t) => (
            <li key={t.id}>
              <Link
                href={ROUTES.TASKS_ID(t.id)}
                className="block truncate rounded bg-zinc-100 px-1 py-0.5 text-xs text-zinc-800 hover:bg-zinc-200"
                title={t.title}
              >
                {t.title}
              </Link>
            </li>
          ))}
          {dayTasks.length > 3 && (
            <li className="text-xs text-zinc-500">+{dayTasks.length - 3} más</li>
          )}
        </ul>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">
          {MONTHS[cursor.month]} {cursor.year}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={prev}
            className="rounded border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-50"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={next}
            className="rounded border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-50"
          >
            Siguiente
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-zinc-500">
        <span>Lun</span>
        <span>Mar</span>
        <span>Mié</span>
        <span>Jue</span>
        <span>Vie</span>
        <span>Sáb</span>
        <span>Dom</span>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">{dayCells}</div>
    </div>
  );
}
