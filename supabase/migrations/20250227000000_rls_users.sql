-- RLS para tabla public.users
-- Ejecutar en Supabase SQL Editor después de aplicar la migración de Prisma (o incluir en el mismo flujo).

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden leer su propia fila
CREATE POLICY "users_select_own"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Solo administradores pueden ver todos los usuarios (para gestión)
CREATE POLICY "users_select_admin"
  ON public.users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Solo administradores pueden actualizar (p. ej. activar usuarios)
CREATE POLICY "users_update_admin"
  ON public.users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Inserción: permitir al propio usuario (para el registro vía API que usa service role o conexión directa)
-- Si la API usa el anon key con RLS, el insert debe hacerse con un role que bypasee RLS o con una política que permita insert cuando id = auth.uid()
CREATE POLICY "users_insert_own"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);
