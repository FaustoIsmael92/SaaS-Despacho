# CANVAS DETALLADO – HITO 4
## Portal de Nómina (Empleados + Eventos)

Desarrollador: 1 persona  
Objetivo estratégico: Permitir a los clientes capturar información estructurada de empleados de forma segura, validada y con trazabilidad histórica.

---

# 🎯 1. OBJETIVO DEL HITO

Implementar un portal externo accesible mediante token único que permita:

- Alta de empleados con validaciones fuertes.
- Registro de bajas.
- Registro de incapacidades.
- Registro de vacaciones.
- Reactivación de empleados.
- Conservación de historial sin eliminación física.

Este hito habilita la captura estructurada de información por parte de los clientes, uno de los objetivos centrales del MVP.

---

# 🛠 2. TAREAS DEL HITO

## Diseño y Base de Datos
- Crear tabla `employees`.
- Crear tabla `payroll_events`.
- Definir relación employees → client.
- Definir relación payroll_events → employee.
- Agregar campos base estándar (id, created_at, updated_at, created_by, is_active).
- Agregar índices en:
  - employee_id
  - client_id
  - estatus
- Crear migración estable del módulo nómina.

## Lógica de Negocio
- Implementar alta completa de empleado con todos los campos definidos en análisis funcional.
- Validar:
  - RFC con estructura válida.
  - NSS exactamente 11 dígitos numéricos.
  - Código Postal 5 dígitos.
- Implementar baja (cambio de estado a “baja”).
- Registrar motivo y fecha de baja.
- Implementar reactivación (cambio a “activo”).
- Registrar incapacidades con rango de fechas.
- Registrar vacaciones con rango de fechas.
- Validar que no existan múltiples incapacidades o vacaciones activas simultáneamente.
- Generar registro independiente por cada evento (histórico).

## Seguridad
- Cifrado de campos sensibles (RFC, NSS).
- Acceso exclusivo mediante token largo y no predecible.
- Validar token contra cliente activo.
- Invalidar acceso si cliente está inactivo.
- Configurar RLS restringido por client_id.
- Implementar validaciones server-side críticas.
- Aplicar rate limiting básico.

## Interfaz de Usuario
- Página pública dinámica por token.
- Formulario estructurado por secciones:
  - Información personal.
  - Información domiciliaria.
  - Información laboral.
  - Información bancaria.
  - Información administrativa.
- Listado de empleados existentes.
- Acciones claras: Alta, Baja, Reactivación.
- Registro visual de incapacidades y vacaciones.

## Pruebas
- Probar flujo completo de alta.
- Probar validaciones incorrectas.
- Probar baja y reactivación.
- Probar registro de múltiples eventos históricos.
- Probar acceso con token inválido.
- Probar acceso con cliente desactivado.

---

# ⚙️ 3. REQUERIMIENTOS TÉCNICOS

- Prisma para migración y modelo relacional.
- Uso de cifrado fuerte para campos sensibles.
- Generación y validación segura de tokens.
- RLS obligatorio por cliente.
- Validaciones críticas reforzadas server-side.
- Manejo consistente de estados (activo / baja).
- Separación clara entre lógica y UI.
- Consultas optimizadas por client_id.

---

# 📌 4. REQUERIMIENTOS FUNCIONALES

- Crear empleado con campos obligatorios validados.
- No permitir RFC inválido.
- No permitir NSS incorrecto.
- No eliminar empleados físicamente.
- Permitir cambio de estado a baja.
- Permitir reactivación.
- Registrar incapacidades con rango de fechas.
- Registrar vacaciones con rango de fechas.
- No permitir eventos activos simultáneos conflictivos.
- Acceso exclusivo mediante enlace único.

---

# ✅ 5. DEFINITION OF DONE (DoD)

El Hito 4 se considera terminado cuando:

- Tablas `employees` y `payroll_events` están migradas y estables.
- No es posible registrar RFC o NSS inválidos.
- Empleados no pueden eliminarse físicamente.
- Bajas y reactivaciones funcionan correctamente.
- Incapacidades y vacaciones generan históricos independientes.
- No existen eventos activos simultáneos conflictivos.
- Campos sensibles están cifrados en base de datos.
- Acceso por token funciona correctamente.
- Token inválido o cliente inactivo bloquea acceso.
- RLS impide acceso entre clientes.
- No existen errores críticos en pruebas manuales.

---

# 🎯 Resultado Esperado

Al finalizar este hito:

- Los clientes pueden capturar información estructurada de nómina.
- Existe historial completo y trazable.
- El sistema protege datos sensibles correctamente.
- El MVP cumple uno de sus objetivos estratégicos principales.

Este es el hito más delicado en términos de seguridad y validación, y marca la madurez funcional del sistema.

