import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { UserStatus } from "@prisma/client";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "user";
  status: UserStatus;
  isActive: boolean;
};

/**
 * Obtiene el usuario de Supabase Auth (sesión).
 */
export async function getAuthSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Obtiene el perfil del usuario desde public.users (rol, estado).
 * Requiere que la fila exista (se crea al registrarse vía API).
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const user = await getAuthSession();
  if (!user?.id) return null;

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!profile) return null;

  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.fullName,
    role: profile.role,
    status: profile.status,
    isActive: profile.isActive,
  };
}

/**
 * Verifica si el usuario está autenticado y activo (puede usar el sistema).
 */
export async function requireActiveUser(): Promise<AuthUser> {
  const authUser = await getAuthUser();
  if (!authUser) {
    throw new Error("NO_AUTH");
  }
  if (authUser.status !== "active" || !authUser.isActive) {
    throw new Error("USER_PENDING");
  }
  return authUser;
}

/**
 * Verifica si el usuario actual es administrador.
 */
export async function requireAdmin(): Promise<AuthUser> {
  const authUser = await requireActiveUser();
  if (authUser.role !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return authUser;
}
