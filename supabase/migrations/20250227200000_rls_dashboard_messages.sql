-- RLS para mensajes del dashboard (todos los usuarios activos pueden leer y crear; cualquiera puede fijar)
ALTER TABLE public.dashboard_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dashboard_messages_select_all"
  ON public.dashboard_messages
  FOR SELECT
  USING (true);

CREATE POLICY "dashboard_messages_insert_authenticated"
  ON public.dashboard_messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "dashboard_messages_update_own_or_pin"
  ON public.dashboard_messages
  FOR UPDATE
  USING (true);

CREATE POLICY "dashboard_messages_delete_own"
  ON public.dashboard_messages
  FOR DELETE
  USING (auth.uid() = user_id);
