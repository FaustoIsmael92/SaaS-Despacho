"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ActivateButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleActivate() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/activate`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Error");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleActivate}
      disabled={loading}
      className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
    >
      {loading ? "…" : "Activar"}
    </button>
  );
}
