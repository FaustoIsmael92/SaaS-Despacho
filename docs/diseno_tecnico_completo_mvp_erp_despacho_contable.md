# DISEÑO TÉCNICO COMPLETO
## MVP – ERP Interno Despacho Contable

---

# 1. PRINCIPIOS RECTORES DEL DISEÑO

El diseño técnico del MVP se rige por los siguientes principios fundamentales:

1. Serverless-first.
2. Infraestructura mínima necesaria.
3. Seguridad prioritaria por manejo de datos sensibles.
4. Arquitectura limpia y modular.
5. Atomic Design como estándar obligatorio de construcción UI.
6. Consultas directas a Supabase como plan A.
7. API Routes únicamente cuando sea estrictamente necesario.

---

# 2. ARQUITECTURA GENERAL DEL SISTEMA

## 2.1 Enfoque Arquitectónico

La aplicación seguirá una arquitectura serverless basada en:

- Frontend: Next.js (App Router)
- Backend lógico: Supabase (PostgreSQL + Auth + RLS)
- Deploy: Vercel

No se implementará un backend separado (Express, Nest, etc.).

## 2.2 Flujo General de Datos

1. Usuario autenticado.
2. Cliente de Supabase en frontend realiza consulta directa.
3. Supabase aplica Row Level Security.
4. Se retorna resultado tipado mediante Prisma o types generados.

## 2.3 Uso de API Routes (Excepcional)

Las API Routes se utilizarán únicamente para:

- Protección de API keys privadas.
- Integraciones externas (email, Google OAuth si se activa).
- Generación segura de PDF.
- Lógica que no deba exponerse al cliente.

Todo lo demás se realizará mediante consultas directas al cliente Supabase.

---

# 3. DISEÑO DE BASE DE DATOS

## 3.1 Motor

PostgreSQL administrado en Supabase.

## 3.2 Principios

- Modelo altamente relacional.
- Integridad referencial obligatoria.
- No eliminación física de registros críticos.
- Uso de estados (activo / inactivo).
- Campos de auditoría en todas las tablas.

## 3.3 Campos Base Estándar

Todas las entidades incluirán:

- id (UUID)
- created_at
- updated_at
- created_by
- is_active

## 3.4 Entidades Principales

- users
- clients
- employees
- payroll_events
- tasks
- subtasks
- comments
- monthly_activities
- urgent_items
- receipts
- receipt_items
- concepts

## 3.5 Reglas Críticas

- Las tareas vencidas se reprograman automáticamente.
- Actividades mensuales se regeneran cada mes.
- Empleados no se eliminan, solo cambian estado.
- Históricos independientes por cada evento.

---

# 4. AUTENTICACIÓN Y AUTORIZACIÓN

## 4.1 Autenticación

Supabase Auth será el proveedor oficial.

Estados:
- Pendiente
- Activo

Solo un administrador podrá activar usuarios.

## 4.2 Autorización

Se implementará Row Level Security en todas las tablas sensibles.

Políticas:
- Usuarios solo pueden ver sus propias tareas.
- Clientes aislados por ID.
- Portal cliente restringido por token único.

---

# 5. SISTEMA DE TAREAS (NÚCLEO DEL SISTEMA)

## 5.1 Modelo

Una tarea puede:
- Tener fecha o no.
- Tener subtareas.
- Tener comentarios.
- Reasignarse.

## 5.2 Lógica Automática

- Si fecha vencida → se mueve al día siguiente.
- Subtareas completadas → cálculo automático de porcentaje.
- Validación de saturación antes de asignar nueva tarea.

## 5.3 Automatizaciones

Se usarán:
- Cron Jobs de Vercel.
- Posibles funciones programadas en Supabase.

---

# 6. PORTAL CLIENTE (NÓMINA)

## 6.1 Acceso

- Acceso exclusivo mediante token largo y no predecible.
- Token regenerable.
- Sin autenticación tradicional.

## 6.2 Validaciones

Campos obligatorios:
- RFC
- NSS
- Código postal
- Nombre completo

## 6.3 Seguridad

- Rate limiting.
- Validación server-side cuando aplique.
- RLS para restringir acceso por cliente.

---

# 7. SISTEMA DE RECIBOS

## 7.1 Folio

Folio incremental controlado por base de datos.

## 7.2 PDF

Generación mediante pdf-lib desde API Route.

## 7.3 Edición

Editable con control de histórico.

---

# 8. SEGURIDAD TÉCNICA

Medidas obligatorias:

- HTTPS automático (Vercel).
- Variables de entorno protegidas.
- Cifrado de campos sensibles (RFC, NSS).
- No eliminación física.
- Backups automáticos de Supabase.
- RLS obligatorio.

---

# 9. DISEÑO UI – ATOMIC DESIGN (MANDATORIO)

## 9.1 Estructura

La aplicación seguirá estrictamente Atomic Design:

1. Atoms
2. Molecules
3. Organisms
4. Templates
5. Pages

## 9.2 Principios

- Componentes lo más pequeños posibles.
- Máxima reutilización.
- Separación estricta de lógica y presentación.
- Componentes desacoplados de datos.

## 9.3 Organización de Carpetas

/components
  /atoms
  /molecules
  /organisms
  /templates
/modules
/lib
/services
/types
/hooks

---

# 10. INFRAESTRUCTURA Y DEVOPS

## 10.1 Entornos

- Local
- Preview (Vercel)
- Producción

## 10.2 Migraciones

Manejadas con Prisma.

## 10.3 Versionado

GitHub como fuente única de verdad.

---

# 11. ESCALABILIDAD CONTROLADA DEL MVP

El sistema está diseñado para:

- 4 usuarios internos.
- 30–40 clientes.
- Hasta 50 empleados por cliente.

Se optimizarán índices en:

- tasks
- employees
- payroll_events
- receipts

---

# 12. CONCLUSIÓN TÉCNICA

El diseño técnico del MVP prioriza:

- Simplicidad estructural.
- Seguridad en datos sensibles.
- Bajo mantenimiento.
- Alta coherencia entre frontend y base de datos.
- Modularidad estricta mediante Atomic Design.

El resultado será un sistema estable, seguro y preparado para evolucionar a una versión posterior sin requerir reestructuración completa.

