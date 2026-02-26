# Documento de Análisis Funcional Completo
## MVP – ERP Interno para Despacho Contable

---

# 1. Introducción

Este documento describe el análisis funcional completo del MVP (Producto Mínimo Viable) de un ERP interno diseñado para un despacho contable.

El sistema tiene como objetivo centralizar la operación interna, estructurar la gestión de tareas del equipo y facilitar la captura organizada de información por parte de los clientes.

El alcance del MVP es exclusivamente interno, para aproximadamente 4 usuarios y entre 30 y 40 clientes activos.

---

# 2. Alcance General del Sistema

El sistema se divide en tres dominios funcionales principales:

1. Gestión Interna del Despacho
2. Gestión Administrativa (Clientes y Recibos)
3. Portal de Nómina para Clientes

No se contempla:
- Comercialización externa
- Soporte multi-despacho
- Auditoría avanzada
- Integraciones fiscales oficiales

---

# 3. Módulo de Usuarios y Autorización

## 3.1 Roles
- Administrador principal (único)
- Contador

## 3.2 Registro y Autorización
- El administrador principal es creado manualmente en base de datos.
- Los contadores se registran desde la pantalla de login.
- El estado inicial del registro es “pendiente”.
- El administrador puede aceptar o rechazar solicitudes.
- El administrador puede desactivar usuarios activos.

No se requiere bitácora de auditoría.

---

# 4. Dashboard – Gestión Interna

El dashboard es el núcleo operativo del sistema.

Se compone de:
- Chat interno
- Tarjetas de tareas por usuario
- Lista personal de tareas
- Sección de urgentes
- Actividades mensuales
- Vista calendario editable

---

## 4.1 Chat Interno

Características:
- Historial limitado al último mes.
- Mensajes editables y eliminables.
- Posibilidad de fijar mensajes.
- Registro de quién fijó el mensaje.
- Notificación visual discreta al ingresar cuando exista un nuevo mensaje fijado.

No incluye búsqueda avanzada.

---

## 4.2 Sistema de Tareas

### Tipos de tareas
- Tareas normales
- Tareas asignadas
- Actividades mensuales (recurrentes personales)

### Características
- Pueden tener fecha o no tener fecha.
- Las tareas sin fecha solo aparecen en lista personal.
- Las tareas con fecha aparecen en tarjetas y calendario.
- Permiten comentarios.
- Permiten subtareas.
- El porcentaje se calcula automáticamente según subtareas completadas.
- Si no tiene subtareas, solo puede marcarse como completada.

### Reprogramación automática
Si una tarea con fecha no es completada y vence:
- Se mueve automáticamente al día siguiente.

### Reasignación
- Las tareas normales pueden arrastrarse entre usuarios.
- Las actividades mensuales no pueden reasignarse.
- Si el usuario destino está saturado, aparece advertencia antes de confirmar.

---

## 4.3 Actividades Mensuales

- Son personales.
- Se reutilizan cada mes.
- Si el mes no contiene el día programado, se ajusta al último día.
- Se regeneran aunque la anterior no haya sido completada.
- Pueden editarse y pausarse.

---

## 4.4 Urgentes

- Son visibles para todos.
- No se asignan a usuarios específicos.
- Se pueden marcar como completados.
- Se archivan, no se eliminan.

---

## 4.5 Vista Calendario

- Muestra tareas con fecha.
- Permite edición directa.
- Permite visualizar rangos de fechas.

---

# 5. Módulo de Clientes

## 5.1 Registro
Campos:
- Nombre (obligatorio)
- RFC (obligatorio)
- Clave patronal (opcional)

No se valida estructura de RFC en este módulo.

## 5.2 Gestión
- Los clientes no se eliminan.
- Solo pueden desactivarse.
- La información histórica se conserva.

---

# 6. Módulo de Recibos

## 6.1 Conceptos
- Nombre único.
- No se permiten duplicados.
- Editables.
- Eliminables.

## 6.2 Recibos

Características:
- Folio automático incremental.
- Múltiples conceptos por recibo.
- Edición completa posterior.
- Eliminación permitida.
- Generación de PDF visual (no descarga automática).

## 6.3 Búsqueda
Filtros combinables:
- Cliente
- Fecha específica
- Mes
- Concepto

Resultados muestran cada concepto como registro independiente.

Los recibos son comprobantes internos no fiscales.

---

# 7. Portal de Nómina para Clientes

Cada cliente cuenta con un enlace único regenerable.
Acceso únicamente por enlace (sin login).

## 7.1 Alta de Empleado
Campos obligatorios:
- Nombre
- Número de Seguridad Social (11 dígitos numéricos)
- RFC (13 caracteres con estructura válida)
- Código Postal

Validaciones:
- NSS debe contener exactamente 11 dígitos numéricos.
- RFC debe tener 4 letras + 6 números + 3 alfanuméricos.

Se crea empleado con estatus “activo”.

## 7.2 Baja
- Selección de empleado existente.
- Registro de observaciones.
- Cambio de estatus a “baja”.

## 7.3 Incapacidad
- Selección de empleado.
- Rango de fechas.
- Observaciones.
- Genera registro independiente.

## 7.4 Vacaciones
- Selección de empleado.
- Rango de fechas.
- Observaciones.
- Genera registro independiente.

No se permiten múltiples incapacidades o vacaciones activas simultáneamente.

## 7.5 Reactivación
- Empleados dados de baja pueden reactivarse.
- Cambia estatus a “activo”.

---

# 8. Reglas Generales del Sistema

- No existe eliminación física de empleados, clientes o registros críticos.
- El sistema maneja estados (activo, inactivo, archivado).
- Las tareas vencidas se reprograman automáticamente.
- Las actividades mensuales se ajustan al calendario real.
- El enlace del cliente puede regenerarse para invalidar el anterior.

---

# 9. Volumen Operativo Estimado

- 4 usuarios internos.
- 30–40 clientes.
- Hasta 50 empleados por cliente.
- ~15 registros de nómina por cliente por mes.

El diseño del MVP debe soportar este volumen sin requerir arquitectura empresarial.

---

# 10. Exclusiones del MVP

- Auditoría avanzada.
- Control granular de permisos.
- Versionado de recibos.
- Integraciones fiscales oficiales.
- Multi-despacho.

---

# 11. Objetivo Final del MVP

Validar que el despacho pueda:

- Centralizar operación interna.
- Organizar tareas con control real de ejecución.
- Recibir información estructurada de clientes.
- Controlar registros históricos sin pérdida de datos.

Este documento define el alcance funcional completo del MVP y servirá como base para el diseño técnico posterior.



---

# 📎 ANEXO A — Catálogo Completo de Campos
## Alta de Empleado (MVP)

Este anexo define la totalidad de campos que deberán contemplarse en el formulario de alta de empleado para el MVP. Sirve como base para:
- Diseño de base de datos
- Validaciones de frontend y backend
- Reglas de negocio
- Escalabilidad futura

---

## 1️⃣ Información Personal

| Campo | Obligatorio | Tipo | Validación / Regla |
|--------|------------|------|--------------------|
| Nombre(s) | Sí | Texto | No vacío |
| Apellido Paterno | Sí | Texto | No vacío |
| Apellido Materno | No | Texto | Opcional |
| Fecha de Nacimiento | Sí | Fecha | Mayor de edad configurable |
| CURP | Sí | Texto | 18 caracteres formato oficial |
| RFC | Sí | Texto | 12 o 13 caracteres formato SAT |
| NSS | Sí | Numérico | 11 dígitos |
| Correo Electrónico | No | Email | Formato válido |
| Teléfono | No | Texto | 10 dígitos |

---

## 2️⃣ Información Domiciliaria

| Campo | Obligatorio | Tipo | Validación |
|--------|------------|------|------------|
| Calle | Sí | Texto | No vacío |
| Número Exterior | Sí | Texto | No vacío |
| Número Interior | No | Texto | Opcional |
| Colonia | Sí | Texto | No vacío |
| Municipio | Sí | Texto | No vacío |
| Estado | Sí | Texto | Catálogo |
| Código Postal | Sí | Numérico | 5 dígitos |

---

## 3️⃣ Información Laboral

| Campo | Obligatorio | Tipo | Validación |
|--------|------------|------|------------|
| Fecha de Ingreso | Sí | Fecha | No futura |
| Tipo de Contrato | Sí | Catálogo | Según LFT |
| Tipo de Jornada | Sí | Catálogo | Diurna / Mixta / Nocturna |
| Puesto | Sí | Texto | No vacío |
| Departamento | No | Texto | Opcional |
| Salario Diario | Sí | Decimal | Mayor a 0 |
| Salario Diario Integrado | Sí | Decimal | Calculado o manual |
| Régimen Fiscal | Sí | Catálogo | Según SAT |
| Riesgo de Trabajo | Sí | Catálogo | Clase I–V |

---

## 4️⃣ Información Bancaria

| Campo | Obligatorio | Tipo | Validación |
|--------|------------|------|------------|
| Banco | No | Texto | Opcional |
| CLABE | No | Numérico | 18 dígitos |
| Número de Cuenta | No | Texto | Opcional |

---

## 5️⃣ Información Administrativa Interna

| Campo | Obligatorio | Tipo | Validación |
|--------|------------|------|------------|
| Estatus | Sí | Catálogo | Activo / Baja |
| Fecha de Baja | No | Fecha | Requerido si estatus = Baja |
| Motivo de Baja | No | Texto | Requerido si estatus = Baja |
| Observaciones | No | Texto largo | Opcional |

---

## 🔐 Consideraciones de Seguridad

- Los datos fiscales y de seguridad social deberán almacenarse cifrados.
- El acceso estará restringido según roles definidos en el sistema.
- Se deberá registrar auditoría de creación y modificación.

---

Este anexo forma parte integral del análisis funcional del MVP y establece la base estructural del módulo de empleados dentro del sistema SaaS de Despacho Contable.

