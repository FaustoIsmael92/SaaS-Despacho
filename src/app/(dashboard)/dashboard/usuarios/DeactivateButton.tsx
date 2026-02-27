"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeactivateButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDeactivate() {
    if (!confirm("¿Desactivar a este usuario? No podrá acceder al sistema hasta que lo actives de nuevo.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/deactivate`, {
        method: "PATCH",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Error al desactivar");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDeactivate}
      disabled={loading}
      className="rounded border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
    >
      {loading ? "…" : "Desactivar"}
    </button>
  );
}
