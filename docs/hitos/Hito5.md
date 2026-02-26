# CANVAS DETALLADO – HITO 5
## Sistema de Recibos + Generación de PDF

Desarrollador: 1 persona  
Objetivo estratégico: Implementar un sistema de comprobantes internos administrativos con control de folio, múltiples conceptos y generación segura de PDF.

---

# 🎯 1. OBJETIVO DEL HITO

Construir un módulo que permita:

- Crear recibos internos no fiscales.
- Asociar múltiples conceptos por recibo.
- Controlar folio incremental automático.
- Editar recibos sin perder trazabilidad.
- Generar visualización en PDF de forma segura.

Este hito completa el ciclo administrativo del MVP.

---

# 🛠 2. TAREAS DEL HITO

## Diseño y Base de Datos
- Crear tabla `concepts`.
- Crear tabla `receipts`.
- Crear tabla `receipt_items`.
- Definir relaciones:
  - receipt → client
  - receipt_items → receipt
  - receipt_items → concept
- Definir campo folio incremental único.
- Agregar índices en:
  - client_id
  - folio
  - fecha
- Crear migración estable del módulo recibos.

## Lógica de Negocio
- CRUD completo de conceptos.
- Validar que nombre de concepto sea único.
- CRUD completo de recibos.
- Permitir múltiples conceptos por recibo.
- Calcular total automáticamente.
- Implementar folio incremental controlado por base de datos.
- Permitir edición posterior del recibo.
- Mantener historial lógico (sin eliminación física).

## Generación de PDF
- Crear API Route segura para generación de PDF.
- Integrar librería pdf-lib.
- Diseñar layout básico profesional.
- Generar PDF en servidor.
- Visualizar PDF en navegador (no descarga automática).
- Proteger ruta para evitar acceso no autorizado.

## Búsqueda y Filtros
- Filtro por cliente.
- Filtro por fecha específica.
- Filtro por mes.
- Filtro por concepto.
- Mostrar resultados por concepto individual cuando aplique.

## Seguridad
- RLS para restringir acceso por cliente.
- Validar que solo usuarios autenticados puedan crear o editar recibos.
- Prevenir manipulación de folio manual.
- Validar concurrencia en generación de folio.

## Pruebas
- Probar creación de múltiples recibos consecutivos.
- Probar concurrencia en generación de folio.
- Probar edición posterior.
- Probar filtros combinados.
- Probar visualización de PDF.

---

# ⚙️ 3. REQUERIMIENTOS TÉCNICOS

- Prisma para migraciones.
- Índice único en folio.
- Control transaccional en creación de recibo.
- API Route obligatoria para generación de PDF.
- pdf-lib para construcción del documento.
- Manejo de totales en backend o lógica segura.
- RLS activo en todas las tablas relacionadas.

---

# 📌 4. REQUERIMIENTOS FUNCIONALES

- Crear concepto único.
- No permitir conceptos duplicados.
- Crear recibo con múltiples conceptos.
- Folio incremental automático.
- Editar recibo después de creado.
- Filtrar recibos por cliente y fecha.
- Visualizar PDF del recibo.
- No eliminar físicamente recibos.

---

# ✅ 5. DEFINITION OF DONE (DoD)

El Hito 5 se considera terminado cuando:

- Tablas `concepts`, `receipts` y `receipt_items` están migradas y estables.
- No es posible duplicar conceptos.
- Folio se genera automáticamente sin errores de concurrencia.
- Totales se calculan correctamente.
- Recibo puede editarse sin romper integridad.
- Filtros funcionan correctamente.
- PDF se genera correctamente desde API Route.
- Usuario no autenticado no puede acceder a recibos.
- No existen errores críticos en pruebas manuales.

---

# 🎯 Resultado Esperado

Al finalizar este hito:

- El sistema cuenta con control administrativo completo.
- Existe trazabilidad de comprobantes internos.
- El ERP cubre operación interna + captura externa + control documental.

Este hito consolida el sistema como herramienta administrativa integral del despacho.

