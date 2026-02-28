"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ROUTES } from "@/config/constants";
import { TaskBoard } from "@/modules/tasks/TaskBoard";
import { TaskCalendar } from "@/modules/tasks/TaskCalendar";
import { DashboardChat } from "@/components/dashboard/DashboardChat";
import { UrgentBar } from "@/components/dashboard/UrgentBar";
import { TodoPanel } from "@/components/dashboard/TodoPanel";
import { ActividadesMensualesModal } from "@/components/dashboard/ActividadesMensualesModal";

type TaskItem = {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  status: string;
  isUrgent: boolean;
  progress: number;
  assignedTo: { id: string; fullName: string };
  createdBy: { id: string; fullName: string };
  subtasks: { id: string; title: string; isCompleted: boolean }[];
  _count?: { comments: number };
};

export function DashboardLayout({ userId }: { userId: string }) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [urgent, setUrgent] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [calendarView, setCalendarView] = useState(false);
  const [monthlyModalOpen, setMonthlyModalOpen] = useState(false);

  const loadTasks = async () => {
    try {
      const [res, urgentRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/tasks/urgent"),
      ]);
      if (res.ok) setTasks(await res.json());
      if (urgentRes.ok) setUrgent(await urgentRes.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const myTasks = tasks.filter((t) => t.assignedTo.id === userId);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between px-4 pt-4">
        <button
          type="button"
          onClick={() => setMonthlyModalOpen(true)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          Actividades mensuales
        </button>
        <button
          type="button"
          onClick={() => setCalendarView((v) => !v)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          {calendarView ? "Vista tarjetas" : "Vista calendario"}
        </button>
      </div>
      <div className="flex flex-1 min-h-0 gap-4 px-4 pb-2">
        <section className="flex w-64 flex-shrink-0 flex-col rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="border-b border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
            Mensajes
          </h2>
          <div className="flex-1 overflow-auto">
            <DashboardChat />
          </div>
        </section>
        <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          {loading ? (
            <div className="flex flex-1 items-center justify-center text-zinc-500">
              Cargando…
            </div>
          ) : calendarView ? (
            <div className="flex-1 overflow-auto p-4">
              <TaskCalendar tasks={tasks} onUpdate={loadTasks} />
            </div>
          ) : (
            <div className="flex-1 overflow-auto p-4">
              <TaskBoard
                tasks={tasks}
                currentUserId={userId}
                onUpdate={loadTasks}
              />
            </div>
          )}
        </section>
        <section className="flex w-80 flex-shrink-0 flex-col rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="border-b border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
            Lista de tareas
          </h2>
          <div className="flex-1 overflow-auto">
            <TodoPanel
              userId={userId}
              tasks={myTasks}
              onUpdate={loadTasks}
            />
          </div>
        </section>
      </div>
      <UrgentBar tasks={urgent} onUpdate={loadTasks} />
      <ActividadesMensualesModal
        open={monthlyModalOpen}
        onClose={() => setMonthlyModalOpen(false)}
      />
    </div>
  );
}
