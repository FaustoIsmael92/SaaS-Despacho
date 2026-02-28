import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

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
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
      <DashboardSidebar user={{ fullName: user.fullName, role: user.role }} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
