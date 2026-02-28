import { getAuthUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/config/constants";
import { prisma } from "@/lib/prisma";
import { getTaskProgress } from "@/types/task";
import { TaskDetailClient } from "@/modules/tasks/TaskDetailClient";

export default async function TaskDetailPage({
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
      assignedTo: { select: { id: true, fullName: true } },
      createdBy: { select: { id: true, fullName: true } },
      subtasks: { orderBy: { createdAt: "asc" } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { id: true, fullName: true } } },
      },
    },
  });

  if (!task) notFound();
  const canView =
    task.assignedToId === user.id ||
    task.createdById === user.id ||
    task.isUrgent;
  if (!canView) notFound();

  const progress = getTaskProgress(task.status, task.subtasks);
  const canEdit = task.assignedToId === user.id || task.createdById === user.id;

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link
          href={ROUTES.TASKS}
          className="text-sm text-zinc-500 hover:text-zinc-700"
        >
          ← Volver a Tareas
        </Link>
        {canEdit && (
          <Link
            href={ROUTES.TASKS_EDIT(id)}
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            Editar
          </Link>
        )}
      </div>
      <TaskDetailClient
        task={{
          id: task.id,
          title: task.title,
          description: task.description,
          dueDate: task.dueDate?.toISOString() ?? null,
          status: task.status,
          isUrgent: task.isUrgent,
          progress,
          assignedTo: task.assignedTo,
          createdBy: task.createdBy,
          subtasks: task.subtasks,
          comments: task.comments.map((c) => ({
            id: c.id,
            content: c.content,
            createdAt: c.createdAt.toISOString(),
            user: c.user,
          })),
        }}
        currentUserId={user.id}
        canEdit={canEdit}
      />
    </div>
  );
}
