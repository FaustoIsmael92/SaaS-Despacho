src/
│
├── app/                        # App Router (rutas reales)
│   ├── (public)/               # Rutas públicas
│   │   ├── page.tsx            # Landing
│   │   ├── login/
│   │   ├── registro/
│   │   ├── pendiente/
│   │   └── portal/
│   │       └── [token]/
│   │           └── page.tsx     # Portal cliente (empleados, alta, baja, incapacidad, vacaciones)
│   │
│   ├── (dashboard)/            # Layout autenticado (sidebar)
│   │   ├── layout.tsx          # DashboardSidebar + main
│   │   ├── page.tsx            # Redirige al dashboard
│   │   ├── dashboard/
│   │   │   ├── page.tsx        # Dashboard principal (3 columnas + urgentes)
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── usuarios/       # Gestión usuarios (admin)
│   │   ├── clientes/
│   │   ├── recibos/
│   │   ├── nomina/
│   │   └── tasks/
│   │       ├── page.tsx
│   │       ├── new/
│   │       └── [id]/
│   │           ├── page.tsx
│   │           └── edit/
│   │
│   └── api/
│       ├── auth/
│       ├── cron/               # reschedule, monthly-activities (Vercel Cron)
│       ├── dashboard-messages/
│       ├── clients/            # GET, POST; [id] GET, PATCH
│       ├── receipts/           # [id]/pdf
│       ├── concepts/
│       ├── tasks/              # urgent, saturation, [id], subtasks, comments
│       ├── monthly-activities/
│       ├── payroll-events/
│       ├── portal/[token]/     # employees, alta, baja, incapacidad, vacaciones, reactivate
│       └── admin/users/        # activate, deactivate
│
├── modules/                    # Lógica por dominio (Feature-based)
│   ├── clients/
│   ├── employees/
│   ├── payroll/
│   ├── tasks/
│   ├── receipts/
│   └── users/
│
├── components/                 # Componentes reutilizables globales
│   ├── ui/                     # Botones, inputs, modales
│   ├── forms/
│   ├── tables/
│   ├── layout/
│   └── feedback/
│
├── lib/                        # Infraestructura técnica
│   ├── prisma.ts
│   ├── supabase.ts
│   ├── auth.ts
│   ├── rls.ts
│   ├── encryption.ts
│   └── utils.ts
│
├── hooks/                      # Custom React hooks
│   ├── useAuth.ts
│   ├── useClient.ts
│   ├── usePagination.ts
│   └── useDebounce.ts
│
├── services/                   # Capa de acceso a datos (opcional si usas Prisma directo)
│   ├── client.service.ts
│   ├── employee.service.ts
│   └── receipt.service.ts
│
├── schemas/                    # Zod / Validaciones
│   ├── employee.schema.ts
│   ├── client.schema.ts
│   └── receipt.schema.ts
│
├── types/                      # Tipos globales
│   ├── api.ts
│   └── common.ts
│
├── config/
│   ├── constants.ts
│   └── roles.ts
│
└── middleware.ts