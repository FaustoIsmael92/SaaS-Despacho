import { prisma } from "@/lib/prisma";
import type { TaskStatus } from "@prisma/client";
import { getTaskProgress } from "@/types/task";

const MAX_ACTIVE_TASKS_PER_USER = 80;

export type TaskWithProgress = Awaited<
  ReturnType<typeof taskService.getById>
> & { progress: number };

/** Cuenta tareas activas (pending) asignadas a un usuario. Para validación de saturación. */
export async function countActiveTasksByUser(userId: string): Promise<number> {
  return prisma.task.count({
    where: {
      assignedToId: userId,
      status: "pending",
      isActive: true,
    },
  });
}

/** Indica si el usuario está por encima del umbral de saturación (solo advertencia). */
export function isOverSaturationLimit(count: number): boolean {
  return count >= MAX_ACTIVE_TASKS_PER_USER;
}

export const taskService = {
  async listByUser(userId: string, options?: { includeUrgent?: boolean }) {
    const tasks = await prisma.task.findMany({
      where: {
        isActive: true,
        OR: [
          { assignedToId: userId },
          { createdById: userId },
          ...(options?.includeUrgent ? [{ isUrgent: true }] : []),
        ],
      },
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
      include: {
        assignedTo: { select: { id: true, fullName: true } },
        createdBy: { select: { id: true, fullName: true } },
        subtasks: { select: { id: true, title: true, isCompleted: true } },
        _count: { select: { comments: true } },
      },
    });
    return tasks.map((t) => ({
      ...t,
      progress: getTaskProgress(t.status, t.subtasks),
    }));
  },

  async listUrgent() {
    return prisma.task.findMany({
      where: { isActive: true, isUrgent: true },
      orderBy: { dueDate: "asc" },
      include: {
        assignedTo: { select: { id: true, fullName: true } },
        createdBy: { select: { id: true, fullName: true } },
        subtasks: { select: { id: true, title: true, isCompleted: true } },
      },
    });
  },

  async getById(id: string) {
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
    if (!task) return null;
    return {
      ...task,
      progress: getTaskProgress(task.status, task.subtasks),
    };
  },

  async create(data: {
    title: string;
    description?: string | null;
    createdById: string;
    assignedToId: string;
    dueDate?: Date | null;
    isUrgent?: boolean;
  }) {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        createdById: data.createdById,
        assignedToId: data.assignedToId,
        dueDate: data.dueDate ?? null,
        isUrgent: data.isUrgent ?? false,
        status: "pending",
      },
      include: {
        assignedTo: { select: { id: true, fullName: true } },
        createdBy: { select: { id: true, fullName: true } },
        subtasks: true,
      },
    });
    return { ...task, progress: 0 };
  },

  async update(
    id: string,
    data: {
      title?: string;
      description?: string | null;
      assignedToId?: string;
      dueDate?: Date | null;
      status?: TaskStatus;
      isUrgent?: boolean;
      isActive?: boolean;
    }
  ) {
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.assignedToId !== undefined && { assignedToId: data.assignedToId }),
        ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.isUrgent !== undefined && { isUrgent: data.isUrgent }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      include: {
        assignedTo: { select: { id: true, fullName: true } },
        createdBy: { select: { id: true, fullName: true } },
        subtasks: { select: { id: true, title: true, isCompleted: true } },
      },
    });
    return { ...task, progress: getTaskProgress(task.status, task.subtasks) };
  },

  async addSubtask(taskId: string, title: string) {
    const subtask = await prisma.subtask.create({
      data: { taskId, title },
    });
    return subtask;
  },

  async updateSubtask(
    subtaskId: string,
    data: { title?: string; isCompleted?: boolean }
  ) {
    return prisma.subtask.update({
      where: { id: subtaskId },
      data,
    });
  },

  async addComment(taskId: string, userId: string, content: string) {
    return prisma.comment.create({
      data: { taskId, userId, content },
    });
  },

  /** Reprogramar tareas vencidas (due_date < hoy) al día siguiente. */
  async rescheduleOverdue() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await prisma.task.updateMany({
      where: {
        status: "pending",
        isActive: true,
        dueDate: { lt: today },
      },
      data: { dueDate: tomorrow },
    });
    return result.count;
  },

  /** Generar tareas del mes a partir de monthly_activities. Ajusta al último día si el mes no tiene ese día.
   * @param month Mes en formato 1-12 (1=enero). Para días del mes se usa "día 0 del mes siguiente" (month sin restar). */
  async generateMonthlyTasksForMonth(year: number, month: number) {
    const daysInMonth = new Date(year, month, 0).getDate(); // month 1-12: día 0 de month = último día del mes anterior
    const activities = await prisma.monthlyActivity.findMany({
      where: { isActive: true },
    });
    let created = 0;
    for (const act of activities) {
      const day = Math.min(act.dayOfMonth, daysInMonth);
      const dueDate = new Date(year, month - 1, day);
      await (prisma as any).task.create({
        data: {
          title: act.title,
          createdById: act.userId,
          assignedToId: act.userId,
          dueDate,
          status: "pending",
          isUrgent: false,
          monthlyActivityId: act.id,
        },
      });
      created++;
    }
    return created;
  },
};
