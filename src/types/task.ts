import type { TaskStatus } from "@prisma/client";

export type TaskWithRelations = {
  id: string;
  title: string;
  description: string | null;
  createdById: string;
  assignedToId: string;
  dueDate: Date | null;
  status: TaskStatus;
  isUrgent: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: { id: string; fullName: string };
  assignedTo?: { id: string; fullName: string };
  subtasks?: Array<{
    id: string;
    title: string;
    isCompleted: boolean;
  }>;
  comments?: Array<{
    id: string;
    content: string;
    userId: string;
    createdAt: Date;
  }>;
};

/** Porcentaje de progreso calculado: 0-100. Si no hay subtareas, 0 o 100 según status. */
export function getTaskProgress(
  status: TaskStatus,
  subtasks: { isCompleted: boolean }[] | undefined
): number {
  if (status === "completed") return 100;
  if (!subtasks?.length) return 0;
  const completed = subtasks.filter((s) => s.isCompleted).length;
  return Math.round((completed / subtasks.length) * 100);
}
