# CANVAS DETALLADO – HITO 2
## Sistema de Tareas (Núcleo Operativo)

Desarrollador: 1 persona  
Objetivo estratégico: Construir el núcleo funcional del ERP que permita organizar, controlar y medir la ejecución del trabajo interno del despacho.

---

# 🎯 1. OBJETIVO DEL HITO

Implementar un sistema completo de gestión de tareas que permita:

- Asignar trabajo entre usuarios.
- Medir progreso real mediante subtareas.
- Reprogramar automáticamente tareas vencidas.
- Visualizar carga operativa por usuario.
- Gestionar actividades recurrentes mensuales.
- Controlar urgentes visibles globalmente.

Este hito convierte al sistema en una herramienta operativa real para el despacho.

---

# 🛠 2. TAREAS DEL HITO

## Diseño y Base de Datos
- Crear tablas:
  - tasks
  - subtasks
  - comments
  - monthly_activities
  - urgent_items
- Definir relaciones (usuario creador, usuario asignado).
- Agregar índices en campos críticos (user_id, due_date, is_active).
- Crear migración estable del módulo tareas.

## Lógica de Negocio
- CRUD completo de tareas.
- Soporte para tareas con fecha y sin fecha.
- Implementar subtareas vinculadas.
- Calcular automáticamente porcentaje de progreso.
- Permitir marcar tarea como completada.
- Implementar comentarios por tarea.
- Permitir reasignación entre usuarios.
- Validación básica de saturación antes de asignar.

## Automatizaciones
- Detectar tareas vencidas.
- Reprogramar automáticamente al día siguiente.
- Implementar cron job (Vercel o función programada).
- Generar actividades mensuales automáticamente.
- Ajustar al último día si el mes no contiene la fecha original.

## Interfaz de Usuario
- Vista tipo tablero por usuario.
- Vista de lista personal.
- Sección de urgentes global.
- Vista calendario editable.
- Edición directa desde calendario.
- Drag & drop para reasignación (si aplica).

## Seguridad
- Configurar RLS:
  - Usuarios solo ven sus tareas.
  - Urgentes visibles para todos.
- Validar que un usuario no pueda modificar tareas ajenas sin permiso.

## Pruebas
- Probar flujo completo con múltiples usuarios.
- Probar reprogramación automática.
- Probar actividades mensuales.
- Probar comentarios y subtareas.

---

# ⚙️ 3. REQUERIMIENTOS TÉCNICOS

- Uso de consultas directas a Supabase como plan principal.
- Prisma para migraciones y esquema.
- Cron jobs configurados correctamente.
- Cálculo de progreso en backend o capa lógica segura.
- Índices optimizados para consultas por usuario y fecha.
- Manejo consistente de estados (activo, completado, archivado).
- Separación clara entre lógica y componentes UI.

---

# 📌 4. REQUERIMIENTOS FUNCIONALES

- Crear tarea con o sin fecha.
- Asignar tarea a usuario.
- Editar tarea.
- Agregar subtareas.
- El progreso se calcula automáticamente.
- Si no tiene subtareas, puede marcarse como completada.
- Las tareas vencidas se reprograman automáticamente.
- Actividades mensuales se regeneran cada mes.
- Urgentes visibles para todos los usuarios.
- Comentarios asociados a tareas.
- Vista calendario funcional.

---

# ✅ 5. DEFINITION OF DONE (DoD)

El Hito 2 se considera terminado cuando:

- Todas las tablas del módulo están migradas y estables.
- CRUD de tareas funciona sin errores.
- Subtareas actualizan correctamente el porcentaje.
- Reprogramación automática funciona en producción.
- Actividades mensuales se generan correctamente.
- RLS impide accesos indebidos.
- Múltiples usuarios pueden usar el sistema simultáneamente.
- No existen consultas lentas en pruebas con volumen estimado.
- No hay errores críticos en consola o servidor.

---

# 🎯 Resultado Esperado

Al finalizar este hito:

- El despacho puede organizar todo su trabajo interno dentro del sistema.
- Existe trazabilidad de ejecución.
- Se reduce riesgo de tareas olvidadas.
- El ERP ya tiene valor operativo real.

Este es el hito que transforma el proyecto de "estructura técnica" a "herramienta de trabajo real".

