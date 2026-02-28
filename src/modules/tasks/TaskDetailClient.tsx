"use client";

import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/config/constants";

type Task = {
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
  comments: {
    id: string;
    content: string;
    createdAt: string;
    user: { id: string; fullName: string };
  }[];
};

export function TaskDetailClient({
  task,
  currentUserId,
  canEdit,
}: {
  task: Task;
  currentUserId: string;
  canEdit: boolean;
}) {
  const [subtasks, setSubtasks] = useState(task.subtasks);
  const [comments, setComments] = useState(task.comments);
  const [newSubtask, setNewSubtask] = useState("");
  const [newComment, setNewComment] = useState("");
  const [loadingSubtask, setLoadingSubtask] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const formatDate = (d: string | null) =>
    d
      ? new Date(d).toLocaleDateString("es-MX", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  const addSubtask = async () => {
    if (!newSubtask.trim() || !canEdit) return;
    setLoadingSubtask(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}/subtasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newSubtask.trim() }),
      });
      if (res.ok) {
        const created = await res.json();
        setSubtasks((prev) => [...prev, { ...created, isCompleted: false }]);
        setNewSubtask("");
      }
    } finally {
      setLoadingSubtask(false);
    }
  };

  const toggleSubtask = async (subtaskId: string, isCompleted: boolean) => {
    if (!canEdit) return;
    setCompletingId(subtaskId);
    try {
      const res = await fetch(`/api/tasks/subtasks/${subtaskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted }),
      });
      if (res.ok) {
        setSubtasks((prev) =>
          prev.map((s) =>
            s.id === subtaskId ? { ...s, isCompleted } : s
          )
        );
      }
    } finally {
      setCompletingId(null);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    setLoadingComment(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment.trim() }),
      });
      if (res.ok) {
        const created = await res.json();
        setComments((prev) => [
          ...prev,
          {
            id: created.id,
            content: created.content,
            createdAt: created.createdAt,
            user: { id: currentUserId, fullName: "Tú" },
          },
        ]);
        setNewComment("");
      }
    } finally {
      setLoadingComment(false);
    }
  };

  const markComplete = async () => {
    if (!canEdit) return;
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" }),
    });
    if (res.ok) window.location.reload();
  };

  const progress =
    task.status === "completed"
      ? 100
      : subtasks.length === 0
        ? 0
        : Math.round(
            (subtasks.filter((s) => s.isCompleted).length / subtasks.length) * 100
          );

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900">{task.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
              <span>Asignado a {task.assignedTo.fullName}</span>
              <span>·</span>
              <span>Creada por {task.createdBy.fullName}</span>
              <span>·</span>
              <span>Vence {formatDate(task.dueDate)}</span>
              {task.isUrgent && (
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-800">
                  Urgente
                </span>
              )}
            </div>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              task.status === "completed"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-zinc-100 text-zinc-700"
            }`}
          >
            {task.status === "completed" ? "Completada" : "Pendiente"}
          </span>
        </div>
        {task.description && (
          <p className="mt-4 text-zinc-600">{task.description}</p>
        )}
        <div className="mt-4 flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200">
            <div
              className="h-full bg-zinc-900 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-zinc-500">{progress}%</span>
        </div>
        {canEdit && task.status === "pending" && (
          <button
            type="button"
            onClick={markComplete}
            className="mt-4 rounded-lg border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            Marcar como completada
          </button>
        )}
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 font-medium text-zinc-900">Subtareas</h2>
        <ul className="space-y-2">
          {subtasks.map((s) => (
            <li key={s.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={s.isCompleted}
                onChange={() => toggleSubtask(s.id, !s.isCompleted)}
                disabled={!canEdit || completingId === s.id}
                className="rounded border-zinc-300"
              />
              <span
                className={
                  s.isCompleted ? "text-zinc-500 line-through" : "text-zinc-900"
                }
              >
                {s.title}
              </span>
            </li>
          ))}
        </ul>
        {canEdit && (
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSubtask()}
              placeholder="Nueva subtarea"
              className="flex-1 rounded border border-zinc-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={addSubtask}
              disabled={loadingSubtask || !newSubtask.trim()}
              className="rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              Agregar
            </button>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 font-medium text-zinc-900">Comentarios</h2>
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="border-l-2 border-zinc-200 pl-3">
              <p className="text-sm text-zinc-900">{c.content}</p>
              <p className="mt-1 text-xs text-zinc-500">
                {c.user.fullName} · {formatDate(c.createdAt)}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribir comentario..."
            rows={2}
            className="flex-1 rounded border border-zinc-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={addComment}
            disabled={loadingComment || !newComment.trim()}
            className="rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
