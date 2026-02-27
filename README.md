# SaaS Despacho Contable

MVP – ERP interno para despachos contables (Hito 1: fundaciones técnicas + autenticación).

## Stack

- **Next.js** (App Router) + TypeScript
- **Supabase** (PostgreSQL + Auth)
- **Prisma** (ORM, migraciones)
- **Vercel** (deploy)

## Requisitos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com) y [Vercel](https://vercel.com)

## Configuración local

### 1. Clonar e instalar

```bash
git clone <repo>
cd saas-despacho
npm install
```

### 2. Variables de entorno

Copia `.env.example` a `.env` y rellena con los valores de tu proyecto Supabase:

```bash
cp .env.example .env
```

- **DATABASE_URL**: Connection string de PostgreSQL (Supabase → Settings → Database).
  - Para migraciones usa la conexión directa (puerto 5432), no Pooler.
- **NEXT_PUBLIC_SUPABASE_URL**: URL del proyecto (Supabase → Settings → API).
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Clave anónima (Settings → API).

### 3. Base de datos y migraciones

```bash
npm run db:migrate
```

(Si es la primera vez y tienes DB vacía: `npm run db:migrate:dev` para crear la migración inicial si hiciera falta.)

### 4. Administrador inicial

1. En Supabase: **Authentication → Users → Add user** (crear usuario con email y contraseña).
2. Copiar el **UUID** del usuario creado.
3. Ejecutar:

```bash
ADMIN_ID=<uuid> ADMIN_EMAIL=admin@tudominio.com npm run db:seed
```

### 5. RLS (Row Level Security)

En Supabase **SQL Editor**, ejecutar el contenido de:

`supabase/migrations/20250227000000_rls_users.sql`

### 6. Arrancar

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Inicia sesión con el usuario admin creado.

## Deploy en Vercel

1. Conecta el repositorio a Vercel.
2. En **Settings → Environment Variables** define:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. En **Build & Development**:
   - Build Command: `prisma generate && next build` (o deja el default si ya incluye `postinstall` con `prisma generate`).
4. Deploy.

## Flujo de usuarios (Hito 1)

- **Registro**: un contador se registra en `/registro`. Queda en estado **pendiente**.
- **Activación**: un administrador entra en **Dashboard → Gestionar usuarios** y activa al nuevo usuario.
- **Acceso**: solo usuarios con estado **activo** pueden usar el dashboard; los pendientes ven la página **Cuenta pendiente de activación** en `/pendiente`.

## Scripts

| Script            | Descripción                    |
|-------------------|--------------------------------|
| `npm run dev`     | Desarrollo                     |
| `npm run build`   | Build producción               |
| `npm run start`   | Servir build                   |
| `npm run db:generate` | Generar cliente Prisma  |
| `npm run db:migrate`   | Aplicar migraciones (producción) |
| `npm run db:migrate:dev` | Crear/aplicar migraciones (desarrollo) |
| `npm run db:studio`    | Abrir Prisma Studio        |
| `npm run db:seed`      | Ejecutar seed (admin)      |

## Estructura (resumen)

- `src/app/(public)/` – Rutas públicas (landing, login, registro, pendiente).
- `src/app/(dashboard)/` – Rutas protegidas (dashboard, usuarios).
- `src/lib/` – Supabase (cliente, server, middleware), Prisma, auth.
- `prisma/` – Schema y migraciones.
- `supabase/migrations/` – SQL adicional (RLS).
