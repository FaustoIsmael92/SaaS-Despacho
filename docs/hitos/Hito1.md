# CANVAS DETALLADO – HITO 1
## Fundaciones Técnicas + Autenticación

Desarrollador: 1 persona  
Objetivo estratégico: Construir una base técnica sólida, segura y escalable sobre la cual se desarrollarán todos los módulos posteriores del MVP.

---

# 🎯 1. OBJETIVO DEL HITO

Establecer la arquitectura base del sistema garantizando:

- Seguridad desde el inicio.
- Integridad estructural del modelo de datos.
- Autenticación funcional con control de estados.
- Entorno de desarrollo y despliegue estable.

Este hito no busca funcionalidades visibles complejas, sino estabilidad estructural.

---

# 🛠 2. TAREAS DEL HITO

## Configuración Inicial
- Crear proyecto NextJS con App Router.
- Configurar TypeScript.
- Configurar ESLint y estructura base de carpetas.
- Conectar proyecto a repositorio GitHub.

## Infraestructura
- Crear proyecto en Supabase.
- Configurar base de datos PostgreSQL.
- Configurar variables de entorno.
- Conectar Supabase con NextJS.

## Prisma
- Instalar Prisma.
- Diseñar schema global (todas las entidades definidas aunque no implementadas).
- Definir campos base estándar:
  - id (UUID)
  - created_at
  - updated_at
  - created_by
  - is_active
- Crear primera migración estable.
- Generar cliente Prisma.

## Autenticación
- Configurar Supabase Auth.
- Implementar registro de contadores.
- Definir estado inicial “pendiente”.
- Crear lógica para activación manual por administrador.
- Restringir acceso a usuarios no activos.

## Autorización
- Configurar Row Level Security básica.
- Políticas mínimas para tabla users.
- Proteger rutas privadas en NextJS.

## UI Base
- Crear layout principal protegido.
- Manejo de sesión en frontend.
- Redirección automática si no autenticado.

## Deploy
- Configurar proyecto en Vercel.
- Verificar variables de entorno en producción.
- Deploy funcional en entorno preview y producción.

---

# ⚙️ 3. REQUERIMIENTOS TÉCNICOS

- NextJS (App Router).
- TypeScript obligatorio.
- Supabase (PostgreSQL + Auth).
- Prisma como ORM.
- Migraciones controladas por Prisma.
- Row Level Security activado.
- Variables de entorno protegidas.
- HTTPS gestionado por Vercel.
- Estructura modular siguiendo Atomic Design.

---

# 📌 4. REQUERIMIENTOS FUNCIONALES

- Un usuario administrador creado manualmente en base de datos.
- Contadores pueden registrarse.
- Nuevo registro queda en estado “pendiente”.
- Solo el administrador puede activar usuarios.
- Usuario no activo no puede acceder al sistema.
- Sistema mantiene sesión activa correctamente.
- No se permite acceso a rutas protegidas sin autenticación.

---

# ✅ 5. DEFINITION OF DONE (DoD)

El Hito 1 se considera terminado cuando:

- El proyecto corre local y en producción sin errores críticos.
- Existe un administrador funcional.
- Un contador puede registrarse.
- El administrador puede activarlo.
- Usuario pendiente no puede acceder.
- Usuario activo puede acceder al dashboard base.
- RLS está habilitado y probado.
- Primera migración estable aplicada correctamente.
- No existen datos sensibles expuestos en el frontend.
- Deploy en Vercel funcionando correctamente.

---

# 🎯 Resultado Esperado

Al finalizar este hito, el sistema contará con:

- Base estructural sólida.
- Seguridad inicial correctamente implementada.
- Autenticación y autorización funcional.
- Infraestructura lista para comenzar el desarrollo del núcleo operativo (Sistema de Tareas).

Este hito reduce significativamente el riesgo técnico del resto del proyecto.

