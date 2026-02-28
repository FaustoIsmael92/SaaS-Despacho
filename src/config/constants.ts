export const APP_NAME = "Despacho Contable";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTRO: "/registro",
  DASHBOARD: "/dashboard",
  CLIENTES: "/clientes",
  RECIBOS: "/recibos",
  NOMINA: "/nomina",
  TASKS: "/tasks",
  TASKS_NEW: "/tasks/new",
  TASKS_ID: (id: string) => `/tasks/${id}`,
  TASKS_EDIT: (id: string) => `/tasks/${id}/edit`,
  DASHBOARD_USUARIOS: "/dashboard/usuarios",
} as const;

export const PUBLIC_PATHS = ["/", "/login", "/registro"] as const;
