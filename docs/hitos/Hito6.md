# CANVAS DETALLADO – HITO 6
## Hardening, Seguridad y Estabilización Final

Desarrollador: 1 persona  
Objetivo estratégico: Convertir el MVP funcional en un sistema estable, seguro y listo para operación diaria real sin fallos críticos.

---

# 🎯 1. OBJETIVO DEL HITO

Fortalecer todo el sistema antes de considerarlo oficialmente listo para uso continuo.

Este hito NO agrega nuevas funcionalidades.
Este hito reduce riesgos técnicos, de seguridad y de rendimiento.

Busca garantizar:

- Seguridad consistente en todos los módulos.
- Rendimiento adecuado con volumen real.
- Correcto funcionamiento de automatizaciones.
- Estabilidad en producción.

---

# 🛠 2. TAREAS DEL HITO

## Revisión de Seguridad
- Revisar todas las políticas RLS tabla por tabla.
- Validar que ningún usuario pueda acceder a datos de otro cliente.
- Verificar aislamiento total en portal de nómina.
- Probar accesos con tokens inválidos o expirados.
- Confirmar cifrado correcto de RFC y NSS.
- Revisar variables de entorno en producción.
- Confirmar que no existan claves expuestas en frontend.

## Optimización de Base de Datos
- Revisar índices en tablas críticas:
  - tasks
  - employees
  - payroll_events
  - receipts
- Analizar consultas más frecuentes.
- Optimizar queries pesadas.
- Verificar tiempos de respuesta aceptables.

## Pruebas de Volumen
- Simular:
  - 4 usuarios simultáneos.
  - 30–40 clientes.
  - Hasta 50 empleados por cliente.
  - ~15 registros mensuales por cliente.
- Verificar que no existan bloqueos o lentitud crítica.

## Automatizaciones
- Validar cron jobs en entorno producción.
- Confirmar reprogramación automática de tareas.
- Confirmar generación correcta de actividades mensuales.
- Validar que no existan ejecuciones duplicadas.

## Estabilidad General
- Probar flujos completos end-to-end:
  - Registro → Activación → Uso.
  - Alta empleado → Baja → Reactivación.
  - Creación de recibo → PDF.
- Probar manejo de errores (inputs inválidos).
- Revisar logs de errores en Vercel.
- Corregir warnings críticos.

## Calidad de Código
- Refactorizar duplicaciones.
- Eliminar código muerto.
- Asegurar separación lógica / UI.
- Revisar consistencia en manejo de estados.
- Documentar decisiones técnicas clave.

## Backup y Recuperación
- Verificar backups automáticos de Supabase.
- Confirmar posibilidad de restauración.
- Documentar procedimiento básico de contingencia.

---

# ⚙️ 3. REQUERIMIENTOS TÉCNICOS

- RLS obligatorio en todas las tablas sensibles.
- Índices optimizados.
- Consultas eficientes.
- Manejo robusto de errores.
- Validaciones críticas server-side.
- Logs monitoreados en producción.
- Backups automáticos verificados.

---

# 📌 4. REQUERIMIENTOS FUNCIONALES

- Ningún usuario puede ver datos ajenos.
- Portal cliente solo accesible con token válido.
- Tareas vencidas se reprograman correctamente.
- Actividades mensuales se regeneran correctamente.
- Recibos mantienen folio sin conflictos.
- Sistema responde en tiempos razonables.
- No se pierden datos críticos.

---

# ✅ 5. DEFINITION OF DONE (DoD)

El Hito 6 se considera terminado cuando:

- Todas las políticas RLS fueron auditadas manualmente.
- No existen accesos cruzados entre clientes.
- Cron jobs funcionan en producción sin errores.
- Sistema soporta volumen estimado sin lentitud crítica.
- No existen errores severos en logs de producción.
- Backups están activos y verificados.
- Código fue revisado y refactorizado.
- El sistema puede operar durante una semana de uso real sin incidentes críticos.

---

# 🎯 Resultado Esperado

Al finalizar este hito:

- El MVP deja de ser "prototipo funcional" y se convierte en "herramienta estable".
- El riesgo operativo se reduce significativamente.
- El sistema está preparado para uso diario continuo.
- El proyecto queda listo para una posible fase 2 o expansión futura.

Este hito es el que convierte tu trabajo técnico en un producto confiable.

