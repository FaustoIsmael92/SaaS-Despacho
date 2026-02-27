import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { ROUTES } from "@/config/constants";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  if (!user) {
    redirect(`/?next=${encodeURIComponent("/dashboard")}`);
  }

  if (user.status !== "active" || !user.isActive) {
    redirect("/pendiente");
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href={ROUTES.DASHBOARD} className="font-semibold text-zinc-900">
            Despacho Contable
          </Link>
          <nav className="flex items-center gap-4">
            <span className="text-sm text-zinc-600">{user.fullName}</span>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm text-zinc-500 underline hover:text-zinc-700"
              >
                Cerrar sesión
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
