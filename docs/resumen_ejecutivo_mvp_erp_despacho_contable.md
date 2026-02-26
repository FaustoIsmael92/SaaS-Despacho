# Resumen Ejecutivo
## MVP – ERP Interno para Despacho Contable

---

## 1. Visión General

El proyecto consiste en el desarrollo de un sistema ERP interno diseñado exclusivamente para un despacho contable con un equipo aproximado de cuatro usuarios.

El objetivo principal del MVP es centralizar la operación interna del despacho, optimizar la gestión de tareas y facilitar la recolección estructurada de información por parte de los clientes, sin sustituir plataformas oficiales gubernamentales, sino funcionando como sistema de organización y transporte de información.

El sistema no está diseñado inicialmente para comercialización externa ni para operación multi-despacho. Su alcance es interno y controlado.

---

## 2. Objetivos del MVP

- Centralizar la información operativa del despacho.
- Mejorar la organización interna mediante un sistema avanzado de gestión de tareas.
- Estandarizar la captura de información de empleados por parte de los clientes.
- Controlar registros de nómina (altas, bajas, incapacidades y vacaciones).
- Generar comprobantes internos de recibos.
- Garantizar seguridad básica para el manejo de información sensible.

---

## 3. Alcance Funcional

El MVP se divide en tres dominios principales:

### A. Gestión Interna del Despacho

Incluye:

- Sistema de usuarios con aprobación manual por administrador.
- Dashboard central con:
  - Chat interno (historial de un mes, mensajes editables y fijables).
  - Sistema de tareas con:
    - Tareas con y sin fecha.
    - Reasignación entre usuarios.
    - Subtareas con cálculo automático de progreso.
    - Comentarios.
    - Reprogramación automática de tareas vencidas.
  - Actividades mensuales recurrentes (reutilizables).
  - Sección de urgentes (global, archivables).
  - Vista calendario editable.


### B. Gestión Administrativa

Incluye:

- Registro de clientes (con opción de desactivación, no eliminación).
- Sistema de recibos internos:
  - Folio automático.
  - Múltiples conceptos por recibo.
  - Edición completa.
  - Búsqueda avanzada por cliente, fecha, mes o concepto.
  - Generación de PDF visual.
- Administración de conceptos únicos.


### C. Portal de Nómina para Clientes

Cada cliente contará con un enlace único (regenerable) para capturar información.

Incluye:

- Alta de empleados con validaciones obligatorias (RFC, NSS, código postal, nombre).
- Baja de empleados.
- Registro de incapacidades (con rango de fechas).
- Registro de vacaciones (con rango de fechas).
- Reactivación de empleados dados de baja.
- Generación automática de registros históricos independientes por cada evento.

No se eliminan empleados ni registros; únicamente se manejan estados.

---

## 4. Reglas Fundamentales del Sistema

- No existe eliminación física de datos críticos (clientes, empleados, registros).
- Las tareas vencidas se reprograman automáticamente al día siguiente.
- Las actividades mensuales se regeneran cada mes y se ajustan al último día cuando el mes no contiene la fecha programada.
- Los recibos son comprobantes internos, no documentos fiscales.
- El acceso al portal cliente se realiza únicamente mediante enlace seguro.

---

## 5. Volumen Operativo Estimado

- 4 usuarios internos.
- 30–40 clientes activos.
- 1–50 empleados por cliente.
- Aproximadamente 15 registros de nómina por cliente por mes.

El sistema está diseñado para soportar este volumen de manera eficiente sin requerir arquitectura empresarial compleja.

---

## 6. Alcance del MVP

Este MVP busca validar:

- La centralización operativa del despacho.
- La viabilidad del portal cliente como herramienta de captura estructurada.
- La eficiencia del sistema interno de tareas como núcleo organizacional.

No incluye auditoría avanzada, permisos complejos multinivel ni automatización fiscal.

---

## 7. Resultado Esperado

Al finalizar el MVP, el despacho contará con:

- Una plataforma única para gestionar clientes, empleados y registros.
- Un sistema interno robusto de organización y seguimiento de tareas.
- Un mecanismo controlado para recibir información de nómina por parte de los clientes.
- Mayor orden operativo, reducción de errores manuales y mejor trazabilidad interna.

---

Este documento representa una visión ejecutiva resumida del proyecto y servirá como base para la elaboración posterior del documento formal de análisis funcional.

