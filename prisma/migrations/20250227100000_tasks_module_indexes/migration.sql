-- Índice para consultas por is_active en el módulo de tareas (Hito 2)
CREATE INDEX IF NOT EXISTS "tasks_is_active_idx" ON "tasks"("is_active");
