import { getAuthUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/config/constants";
import { prisma } from "@/lib/prisma";
import { TaskForm } from "@/modules/tasks/TaskForm";

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAuthUser();
  if (!user) return null;
  const { id } = await params;

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { id: true } },
    },
  });

  if (!task) notFound();
  const canEdit =
    task.assignedToId === user.id || task.createdById === user.id;
  if (!canEdit) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link
          href={ROUTES.TASKS_ID(id)}
          className="text-sm text-zinc-500 hover:text-zinc-700"
        >
          ← Volver al detalle
        </Link>
      </div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">
        Editar tarea
      </h1>
      <TaskForm
        createdById={user.id}
        taskId={id}
        initialData={{
          title: task.title,
          description: task.description,
          assignedToId: task.assignedToId,
          dueDate: task.dueDate ? task.dueDate.toISOString() : null,
          isUrgent: task.isUrgent,
        }}
      />
    </div>
  );
}
