# CANVAS DE HITOS – MVP ERP DESPACHO CONTABLE

Desarrollador: 1 persona  
Enfoque: Serverless-first, modular, incremental  
Objetivo: Construir un MVP estable, usable y escalable sin sobreingeniería.

---

# 🥇 HITO 1 – Fundaciones Técnicas y Autenticación

## Objetivo
Construir la base estructural y de seguridad sobre la que descansará todo el sistema.

## Qué significa para ti como único desarrollador
Este hito es arquitectura pura. No es visualmente impresionante, pero es crítico. Si aquí haces las cosas bien, los demás módulos serán mucho más simples.

## Entregables
- Proyecto NextJS + TypeScript configurado
- Supabase conectado
- Prisma configurado con esquema global diseñado
- Migración inicial estable
- Tabla users extendida
- Supabase Auth funcionando
- Flujo de registro con estado “pendiente”
- Activación manual por administrador
- RLS base configurado
- Layout protegido
- Primer deploy en Vercel funcionando

## Resultado del hito
Sistema seguro, autenticado y estructuralmente listo para crecer.

---

# 🥈 HITO 2 – Sistema de Tareas (Núcleo Operativo)

## Objetivo
Construir el corazón del sistema. Aquí empieza el valor real del producto.

## Qué significa para ti
Este módulo valida si el ERP realmente mejora la operación del despacho. Aquí implementas lógica real, automatizaciones y control de estados.

## Entregables
- Tablas: tasks, subtasks, comments, monthly_activities, urgent_items
- CRUD completo de tareas
- Subtareas con cálculo automático de progreso
- Comentarios funcionales
- Tareas con fecha y sin fecha
- Vista tipo tablero por usuario
- Vista calendario
- Reasignación de tareas
- Reprogramación automática de tareas vencidas
- Cron job funcionando

## Resultado del hito
El despacho ya puede usar el sistema internamente.

---

# 🥉 HITO 3 – Módulo de Clientes

## Objetivo
Crear la estructura administrativa base para soportar nómina y recibos.

## Qué significa para ti
Es un módulo estructural, más simple técnicamente pero clave para el siguiente paso.

## Entregables
- Tabla clients
- CRUD completo
- Activación / desactivación
- Generación de token largo y único
- Regeneración de token
- RLS por cliente
- Validación de aislamiento de datos

## Resultado del hito
Base lista para permitir captura externa de información.

---

# 🏅 HITO 4 – Portal de Nómina

## Objetivo
Permitir a los clientes capturar información estructurada de empleados.

## Qué significa para ti
Es el módulo más delicado. Maneja datos sensibles, validaciones fuertes y lógica de estados.

## Entregables
- Tablas: employees y payroll_events
- Migración estable del módulo
- Formulario completo de alta de empleado
- Validaciones RFC, NSS, Código Postal
- Cifrado de datos sensibles
- Baja de empleado (cambio de estado)
- Reactivación
- Registro de incapacidades
- Registro de vacaciones
- Validación de no eventos activos simultáneos
- Acceso mediante token sin login
- RLS restringido por cliente

## Resultado del hito
Portal cliente funcional y estructurado.

---

# 🧾 HITO 5 – Recibos + PDF

## Objetivo
Permitir generación de comprobantes internos administrativos.

## Qué significa para ti
Es un módulo más aislado, pero requiere precisión en control de folios y generación de PDF.

## Entregables
- Tablas: concepts, receipts, receipt_items
- Control de conceptos únicos
- Creación de recibo con múltiples conceptos
- Folio incremental automático
- Edición de recibos
- Filtros de búsqueda
- API Route para generación de PDF
- Visualización segura en navegador

## Resultado del hito
Sistema administrativo completo.

---

# 🚀 HITO 6 – Hardening y Estabilización

## Objetivo
Convertir el MVP en un sistema estable y seguro.

## Qué significa para ti
Este hito no agrega funcionalidades nuevas, pero asegura que el sistema no falle en producción.

## Entregables
- Revisión completa de políticas RLS
- Optimización de índices en tablas críticas
- Pruebas con volumen real estimado
- Validación de cron jobs
- Revisión de regeneración de tokens
- Pruebas de seguridad del portal
- Validación de cifrado
- Manejo adecuado de errores
- Limpieza y refactorización de código
- Documentación técnica básica

## Resultado del hito
MVP estable, seguro y listo para operación diaria real.

---

# 🎯 Visión Final

Al completar estos 6 hitos:

- Tendrás un ERP interno funcional.
- El despacho podrá centralizar su operación.
- Los clientes podrán capturar información estructurada.
- Existirá control administrativo con trazabilidad.
- El sistema estará preparado para evolucionar sin reestructuración completa.

Este roadmap está optimizado para un único desarrollador trabajando de manera estructurada y sin sobrecarga innecesaria.

