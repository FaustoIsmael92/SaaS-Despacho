"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ROUTES } from "@/config/constants";
import { TaskList } from "./TaskList";
import { TaskBoard } from "./TaskBoard";
import { UrgentSection } from "./UrgentSection";
import { TaskCalendar } from "./TaskCalendar";
import { MonthlyActivitiesSection } from "./MonthlyActivitiesSection";

type Tab = "list" | "board" | "urgent" | "calendar" | "monthly";

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

export function TasksView({ userId }: { userId: string }) {
  const [tab, setTab] = useState<Tab>("list");
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [urgent, setUrgent] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  const tabs: { id: Tab; label: string }[] = [
    { id: "list", label: "Mi lista" },
    { id: "board", label: "Tablero" },
    { id: "urgent", label: "Urgentes" },
    { id: "calendar", label: "Calendario" },
    { id: "monthly", label: "Recurrentes" },
  ];

  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-zinc-500">
        Cargando tareas…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-zinc-200">
        <nav className="flex gap-6" aria-label="Vistas de tareas">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`border-b-2 py-3 text-sm font-medium transition-colors ${
                tab === id
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {tab === "list" && (
        <TaskList tasks={myTasks} onUpdate={loadTasks} />
      )}
      {tab === "board" && (
        <TaskBoard tasks={tasks} currentUserId={userId} onUpdate={loadTasks} />
      )}
      {tab === "urgent" && (
        <UrgentSection tasks={urgent} onUpdate={loadTasks} />
      )}
      {tab === "calendar" && (
        <TaskCalendar tasks={tasks} onUpdate={loadTasks} />
      )}
      {tab === "monthly" && <MonthlyActivitiesSection />}
    </div>
  );
}
