-- RLS para módulo de tareas (Hito 2)
-- Usuarios ven sus tareas (asignadas o creadas por ellos) y todas las urgentes.
-- Urgentes visibles para todos.

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_activities ENABLE ROW LEVEL SECURITY;

-- TASKS: ver tarea si está asignada a ti, la creaste tú, o es urgente
CREATE POLICY "tasks_select_own_or_urgent"
  ON public.tasks
  FOR SELECT
  USING (
    assigned_to = auth.uid()
    OR created_by = auth.uid()
    OR is_urgent = true
  );

-- TASKS: insertar con created_by = usuario actual
CREATE POLICY "tasks_insert_own"
  ON public.tasks
  FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- TASKS: actualizar si estás asignado o eres el creador (permite reasignación)
CREATE POLICY "tasks_update_assignee_or_creator"
  ON public.tasks
  FOR UPDATE
  USING (assigned_to = auth.uid() OR created_by = auth.uid());

-- TASKS: eliminar solo creador (soft delete preferible; si no hay soft delete, solo creador)
CREATE POLICY "tasks_delete_creator"
  ON public.tasks
  FOR DELETE
  USING (created_by = auth.uid());

-- SUBTASKS: ver si la tarea padre es visible
CREATE POLICY "subtasks_select_task_visible"
  ON public.subtasks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = subtasks.task_id
      AND (t.assigned_to = auth.uid() OR t.created_by = auth.uid() OR t.is_urgent = true)
    )
  );

-- SUBTASKS: insertar si la tarea es tuya (asignada o creada por ti)
CREATE POLICY "subtasks_insert_task_own"
  ON public.subtasks
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = subtasks.task_id
      AND (t.assigned_to = auth.uid() OR t.created_by = auth.uid())
    )
  );

-- SUBTASKS: actualizar/eliminar misma condición
CREATE POLICY "subtasks_update_task_own"
  ON public.subtasks
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = subtasks.task_id
      AND (t.assigned_to = auth.uid() OR t.created_by = auth.uid())
    )
  );

CREATE POLICY "subtasks_delete_task_own"
  ON public.subtasks
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = subtasks.task_id
      AND (t.assigned_to = auth.uid() OR t.created_by = auth.uid())
    )
  );

-- COMMENTS: ver si la tarea es visible
CREATE POLICY "comments_select_task_visible"
  ON public.comments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = comments.task_id
      AND (t.assigned_to = auth.uid() OR t.created_by = auth.uid() OR t.is_urgent = true)
    )
  );

-- COMMENTS: insertar si puedes ver la tarea (asignada/creada por ti o urgente) y user_id = auth.uid()
CREATE POLICY "comments_insert_own"
  ON public.comments
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = comments.task_id
      AND (t.assigned_to = auth.uid() OR t.created_by = auth.uid() OR t.is_urgent = true)
    )
  );

-- COMMENTS: actualizar/eliminar solo el autor del comentario
CREATE POLICY "comments_update_own"
  ON public.comments
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "comments_delete_own"
  ON public.comments
  FOR DELETE
  USING (user_id = auth.uid());

-- MONTHLY_ACTIVITIES: solo ver y gestionar las propias
CREATE POLICY "monthly_activities_select_own"
  ON public.monthly_activities
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "monthly_activities_insert_own"
  ON public.monthly_activities
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "monthly_activities_update_own"
  ON public.monthly_activities
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "monthly_activities_delete_own"
  ON public.monthly_activities
  FOR DELETE
  USING (user_id = auth.uid());
