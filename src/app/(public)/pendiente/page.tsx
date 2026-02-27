import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PendientePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (profile?.status === "active" && profile?.isActive) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-zinc-900">
          Cuenta pendiente de activación
        </h1>
        <p className="mt-3 text-zinc-600">
          Tu registro ha sido recibido. Un administrador debe activar tu cuenta
          para que puedas acceder al sistema.
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          Si ya te han activado,{" "}
          <Link href="/dashboard" className="font-medium text-zinc-900 underline">
            intenta entrar al dashboard
          </Link>
          .
        </p>
        <form action="/api/auth/signout" method="post" className="mt-6">
          <button
            type="submit"
            className="text-sm text-zinc-500 underline hover:text-zinc-700"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );
}
