"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/config/constants";
import { useTheme } from "@/components/layout/ThemeProvider";
import { VerSolicitudesModal } from "@/components/layout/VerSolicitudesModal";

type SidebarProps = {
  user: { fullName: string; role: string };
};

const navItems = [
  { href: ROUTES.DASHBOARD, label: "Dashboard" },
  { href: ROUTES.CLIENTES, label: "Añadir cliente" },
  { href: ROUTES.RECIBOS, label: "Recibos" },
  { href: ROUTES.NOMINA, label: "Nómina" },
];

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [configOpen, setConfigOpen] = useState(false);
  const [cuentaOpen, setCuentaOpen] = useState(false);
  const [solicitudesOpen, setSolicitudesOpen] = useState(false);

  return (
    <>
      <aside className="flex h-full w-52 flex-col border-r border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex h-14 items-center border-b border-zinc-200 px-4 dark:border-zinc-700">
          <Link
            href={ROUTES.DASHBOARD}
            className="font-semibold text-zinc-900 dark:text-zinc-100"
          >
            Despacho Contable
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 p-2">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-zinc-200 p-2 dark:border-zinc-700">
          <div className="relative">
            <button
              type="button"
              onClick={() => setConfigOpen((o) => !o)}
              className="w-full rounded-md px-3 py-1.5 text-left text-xs text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Configuración
            </button>
            {configOpen && (
              <div className="absolute bottom-full left-0 mb-1 w-full rounded-md border border-zinc-200 bg-white py-1 shadow dark:border-zinc-700 dark:bg-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setTheme(theme === "dark" ? "light" : "dark");
                  }}
                  className="block w-full px-3 py-1.5 text-left text-xs text-zinc-700 dark:text-zinc-300"
                >
                  {theme === "dark" ? "Modo claro" : "Modo oscuro"}
                </button>
                {user.role === "admin" && (
                  <button
                    type="button"
                    onClick={() => {
                      setSolicitudesOpen(true);
                      setConfigOpen(false);
                    }}
                    className="block w-full px-3 py-1.5 text-left text-xs text-zinc-700 dark:text-zinc-300"
                  >
                    Ver solicitudes
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setCuentaOpen((o) => !o)}
              className="w-full rounded-md px-3 py-1.5 text-left text-xs text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Cuenta
            </button>
            {cuentaOpen && (
              <div className="absolute bottom-full left-0 mb-1 w-full rounded-md border border-zinc-200 bg-white py-1 shadow dark:border-zinc-700 dark:bg-zinc-800">
                <span className="block px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                  {user.fullName}
                </span>
                <form action="/api/auth/signout" method="post">
                  <button
                    type="submit"
                    className="block w-full px-3 py-1.5 text-left text-xs text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    Cerrar sesión
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </aside>
      {user.role === "admin" && (
        <VerSolicitudesModal
          open={solicitudesOpen}
          onClose={() => setSolicitudesOpen(false)}
        />
      )}
    </>
  );
}
