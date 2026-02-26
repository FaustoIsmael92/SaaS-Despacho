src/
│
├── app/                        # App Router (rutas reales)
│   ├── (public)/               # Rutas públicas
│   │   ├── page.tsx            # Landing
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── portal/
│   │       └── [token]/
│   │           ├── page.tsx
│   │           ├── receipts/
│   │           └── employees/
│   │
│   ├── (dashboard)/            # Layout autenticado
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Dashboard
│   │   │
│   │   ├── clients/
│   │   ├── employees/
│   │   ├── payroll-events/
│   │   ├── tasks/
│   │   ├── receipts/
│   │   └── settings/
│   │
│   └── api/                    # SOLO si necesitas ocultar secretos
│       └── secure/
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