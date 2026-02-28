import { z } from "zod";

export const taskStatusEnum = z.enum(["pending", "completed"]);

export const createTaskSchema = z.object({
  title: z.string().min(1, "El título es obligatorio").max(200),
  description: z.string().max(5000).optional().nullable(),
  assignedToId: z.string().uuid(),
  dueDate: z.union([z.string(), z.null(), z.undefined()]).optional(),
  isUrgent: z.boolean().default(false),
});
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional().nullable(),
  assignedToId: z.string().uuid().optional(),
  dueDate: z.union([z.string(), z.null(), z.undefined()]).optional(),
  status: taskStatusEnum.optional(),
  isUrgent: z.boolean().optional(),
  isActive: z.boolean().optional(),
});
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const createSubtaskSchema = z.object({
  taskId: z.string().uuid(),
  title: z.string().min(1, "El título es obligatorio").max(200),
});
export type CreateSubtaskInput = z.infer<typeof createSubtaskSchema>;

export const updateSubtaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  isCompleted: z.boolean().optional(),
});
export type UpdateSubtaskInput = z.infer<typeof updateSubtaskSchema>;

export const createCommentSchema = z.object({
  taskId: z.string().uuid(),
  content: z.string().min(1, "El comentario no puede estar vacío").max(2000),
});
export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export const createMonthlyActivitySchema = z.object({
  title: z.string().min(1, "El título es obligatorio").max(200),
  dayOfMonth: z.number().int().min(1).max(31),
});
export type CreateMonthlyActivityInput = z.infer<
  typeof createMonthlyActivitySchema
>;

export const updateMonthlyActivitySchema = createMonthlyActivitySchema.partial().extend({
  isActive: z.boolean().optional(),
});
export type UpdateMonthlyActivityInput = z.infer<
  typeof updateMonthlyActivitySchema
>;
