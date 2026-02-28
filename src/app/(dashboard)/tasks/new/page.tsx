import { getAuthUser } from "@/lib/auth";
import Link from "next/link";
import { ROUTES } from "@/config/constants";
import { TaskForm } from "@/modules/tasks/TaskForm";

export default async function NewTaskPage() {
  const user = await getAuthUser();
  if (!user) return null;

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link
          href={ROUTES.TASKS}
          className="text-sm text-zinc-500 hover:text-zinc-700"
        >
          ← Volver a Tareas
        </Link>
      </div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Nueva tarea</h1>
      <TaskForm createdById={user.id} />
    </div>
  );
}
