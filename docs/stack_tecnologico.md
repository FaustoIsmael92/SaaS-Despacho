# Stack Tecnológico Final Recomendado
## MVP – ERP Interno Despacho Contable

---

# 1. Filosofía del Stack

El stack tecnológico seleccionado está optimizado para:

- Desarrollo ágil con IA (Cursor).
- Bajo mantenimiento de infraestructura.
- Alta seguridad para datos sensibles.
- Escalabilidad moderada sin complejidad enterprise.
- Integración nativa con Vercel.

El enfoque es serverless-first, delegando infraestructura siempre que sea posible.

---

# 2. Frontend

## Next.js (App Router)

- Framework principal de la aplicación.
- Renderizado híbrido (Server Components + Client Components).
- Manejo de rutas dinámicas (portal cliente por token).
- API Routes cuando sea estrictamente necesario.

## TypeScript

- Tipado fuerte.
- Mejor integración con Prisma.
- Mayor estabilidad en un sistema ERP.

---

# 3. Backend

## Next.js API Routes

Uso limitado para:

- Protección de llaves privadas.
- Integraciones externas (Google Calendar, email).
- Generación de PDF.

No se utilizará un backend separado (Express o similar).

---

# 4. Base de Datos

## PostgreSQL (Motor Obligatorio)

Justificación:

- Modelo altamente relacional (clientes → empleados → registros).
- Integridad referencial.
- Soporte para transacciones.
- Alto nivel de estabilidad.

## Proveedor Recomendado: Supabase

Ventajas:

- PostgreSQL administrado.
- Seguridad integrada.
- Row Level Security (RLS).
- Backups automáticos.
- Autenticación integrada.
- Buena integración con Next.js.

No se recomienda usar hosting propio para la base de datos en esta etapa.

---

# 5. ORM

## Prisma

- Definición clara del esquema de base de datos.
- Migraciones estructuradas.
- Excelente compatibilidad con PostgreSQL.
- Tipado automático con TypeScript.
- Ideal para desarrollo asistido por IA.

---

# 6. Autenticación

## Supabase Auth

- Registro y login.
- Manejo de estado pendiente / activo.
- Tokens seguros.
- Integración directa con PostgreSQL.

---

# 7. Generación de PDF

## pdf-lib

- Generación de recibos internos.
- Apertura en navegador.
- Control total sobre diseño.

---

# 8. Servicio de Email

## Resend (Recomendado)

- Integración sencilla con Vercel.
- Mejor entregabilidad.
- Configuración rápida.

Alternativa viable: Brevo.

---

# 9. Sincronización con Google Calendar

- OAuth 2.0.
- Almacenamiento seguro de refresh tokens.
- Sincronización unidireccional (solo push desde sistema hacia Google).

---

# 10. Seguridad

Medidas obligatorias:

- HTTPS (gestionado por Vercel).
- Variables de entorno protegidas.
- Tokens largos y no predecibles para portal cliente.
- No eliminación física de registros críticos.
- Uso de estados (activo / inactivo).
- Cifrado de datos sensibles (RFC, NSS).

---

# 11. Infraestructura y DevOps

## IDE
Cursor (desarrollo asistido por IA).

## Control de Versiones
GitHub.

## Deploy
Vercel (CI/CD automático).

No se utilizará Docker ni contenedores en el MVP.

---

# 12. Stack Final Consolidado

Frontend:
- Next.js
- TypeScript

Backend:
- API Routes (cuando sea necesario)

Base de Datos:
- PostgreSQL (Supabase)

ORM:
- Prisma

Auth:
- Supabase Auth

Email:
- Resend

PDF:
- pdf-lib

Deploy:
- Vercel

Versionado:
- GitHub

Desarrollo:
- Cursor + Agente IA

---

Este stack está optimizado para el alcance real del MVP, priorizando estabilidad, seguridad y velocidad de desarrollo sin introducir complejidad innecesaria.

