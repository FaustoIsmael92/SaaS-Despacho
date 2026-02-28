"use client";

import { useState, useEffect } from "react";

type Message = {
  id: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  user: { id: string; fullName: string };
};

export function DashboardChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newContent, setNewContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const load = () => {
    fetch("/api/dashboard-messages")
      .then((r) => r.json())
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/dashboard-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent.trim() }),
      });
      if (res.ok) {
        const created = await res.json();
        setMessages((prev) => [created, ...prev]);
        setNewContent("");
      }
    } finally {
      setSending(false);
    }
  };

  const togglePin = async (id: string, isPinned: boolean) => {
    const res = await fetch(`/api/dashboard-messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPinned: !isPinned }),
    });
    if (res.ok) {
      const updated = await res.json();
      setMessages((prev) =>
        prev
          .map((m) => (m.id === id ? updated : m))
          .sort((a, b) => {
            if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          })
      );
    }
  };

  if (loading) {
    return (
      <div className="p-3 text-center text-sm text-zinc-500">Cargando…</div>
    );
  }

  return (
    <div className="flex flex-col">
      <form onSubmit={send} className="border-b border-zinc-200 p-2 dark:border-zinc-700">
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Escribir mensaje..."
          rows={2}
          maxLength={2000}
          className="w-full resize-none rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <button
          type="submit"
          disabled={sending || !newContent.trim()}
          className="mt-1 w-full rounded bg-zinc-800 py-1 text-xs text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-600"
        >
          Enviar
        </button>
      </form>
      <ul className="flex-1 space-y-1 overflow-auto p-2">
        {messages.map((m) => (
          <li
            key={m.id}
            className={`rounded border px-2 py-1.5 text-sm ${
              m.isPinned
                ? "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30"
                : "border-zinc-200 dark:border-zinc-600"
            }`}
          >
            <div className="flex items-start justify-between gap-1">
              <p className="min-w-0 flex-1 break-words text-zinc-900 dark:text-zinc-100">
                {m.content}
              </p>
              <button
                type="button"
                onClick={() => togglePin(m.id, m.isPinned)}
                className="shrink-0 text-amber-500 hover:text-amber-600"
                title={m.isPinned ? "Desfijar" : "Fijar"}
              >
                {m.isPinned ? "★" : "☆"}
              </button>
            </div>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {m.user.fullName}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
