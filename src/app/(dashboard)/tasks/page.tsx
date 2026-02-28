import { getAuthUser } from "@/lib/auth";
import Link from "next/link";
import { ROUTES } from "@/config/constants";
import { TasksView } from "@/modules/tasks/TasksView";

export default async function TasksPage() {
  const user = await getAuthUser();
  if (!user) return null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Tareas</h1>
        <Link
          href={ROUTES.TASKS_NEW}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Nueva tarea
        </Link>
      </div>
      <TasksView userId={user.id} />
    </div>
  );
}
