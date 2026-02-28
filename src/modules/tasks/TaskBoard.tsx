"use client";

import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/config/constants";

type Task = {
  id: string;
  title: string;
  dueDate: string | null;
  status: string;
  isUrgent: boolean;
  progress: number;
  assignedTo: { id: string; fullName: string };
  createdBy?: { id: string; fullName: string };
  monthlyActivityId?: string | null;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
function isWithinNext7Days(d: string | null): boolean {
  if (!d) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(d);
  due.setHours(0, 0, 0, 0);
  const diff = (due.getTime() - today.getTime()) / MS_PER_DAY;
  return diff >= 0 && diff < 7;
}

export function TaskBoard({
  tasks,
  currentUserId,
  onUpdate,
}: {
  tasks: Task[];
  currentUserId: string;
  onUpdate: () => void;
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetUserId, setDropTargetUserId] = useState<string | null>(null);

  const next7Days = tasks.filter(
    (t) => t.status !== "completed" && isWithinNext7Days(t.dueDate)
  );
  const byUser = next7Days.reduce<Record<string, Task[]>>((acc, t) => {
    const uid = t.assignedTo.id;
    if (!acc[uid]) acc[uid] = [];
    acc[uid].push(t);
    return acc;
  }, {});

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("es-MX", { day: "numeric", month: "short" }) : "—";

  const taskTypeLabel = (t: Task) => {
    if (t.monthlyActivityId) return { label: "Mensual", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200" };
    if (t.createdBy && t.createdBy.id !== t.assignedTo.id)
      return { label: `Asignada por ${t.createdBy.fullName}`, className: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200" };
    return { label: "Lista", className: "bg-zinc-100 text-zinc-700 dark:bg-zinc-600 dark:text-zinc-200" };
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    if (task.monthlyActivityId) {
      e.preventDefault();
      return;
    }
    setDraggingId(task.id);
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDropTargetUserId(null);
  };

  const handleDragOver = (e: React.DragEvent, userId: string) => {
    e.preventDefault();
    if (draggingId) setDropTargetUserId(userId);
  };

  const handleDragLeave = () => setDropTargetUserId(null);

  const handleDrop = async (e: React.DragEvent, targetUserId: string) => {
    e.preventDefault();
    setDropTargetUserId(null);
    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.monthlyActivityId || task.assignedTo.id === targetUserId) {
      setDraggingId(null);
      return;
    }
    setDraggingId(null);
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedToId: targetUserId }),
    });
    if (res.ok) onUpdate();
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {Object.entries(byUser).map(([userId, userTasks]) => (
        <div
          key={userId}
          onDragOver={(e) => handleDragOver(e, userId)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, userId)}
          className={`min-w-[280px] flex-shrink-0 rounded-lg border bg-white dark:bg-zinc-900 ${
            dropTargetUserId === userId
              ? "border-zinc-400 ring-2 ring-zinc-300 dark:border-zinc-500"
              : "border-zinc-200 dark:border-zinc-700"
          }`}
        >
          <div className="border-b border-zinc-100 px-3 py-2 font-medium text-zinc-800 dark:border-zinc-700 dark:text-zinc-200">
            {userTasks[0]?.assignedTo.fullName ?? "Sin asignar"}
            {userId === currentUserId && (
              <span className="ml-1 text-xs text-zinc-500">(tú)</span>
            )}
          </div>
          <ul className="divide-y divide-zinc-100 p-2 dark:divide-zinc-700">
            {userTasks.map((t) => {
              const type = taskTypeLabel(t);
              const draggable = !t.monthlyActivityId;
              return (
                <li
                  key={t.id}
                  draggable={draggable}
                  onDragStart={(e) => handleDragStart(e, t)}
                  onDragEnd={handleDragEnd}
                  className={`rounded ${draggingId === t.id ? "opacity-50" : ""} ${draggable ? "cursor-grab active:cursor-grabbing" : ""}`}
                >
                  <Link
                    href={ROUTES.TASKS_ID(t.id)}
                    className="block rounded p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    onClick={(e) => draggable && e.stopPropagation()}
                  >
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {t.title}
                    </span>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      <span className={`rounded px-1 ${type.className}`}>
                        {type.label}
                      </span>
                      <span>{formatDate(t.dueDate)}</span>
                      <span>{t.progress}%</span>
                      {t.isUrgent && (
                        <span className="rounded bg-amber-100 px-1 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                          Urgente
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      {Object.keys(byUser).length === 0 && (
        <div className="w-full rounded-lg border border-zinc-200 bg-white p-8 text-center text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900">
          No hay tareas en los próximos 7 días.
        </div>
      )}
    </div>
  );
}
