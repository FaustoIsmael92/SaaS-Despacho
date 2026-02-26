# CANVAS DETALLADO – HITO 3
## Módulo de Clientes

Desarrollador: 1 persona  
Objetivo estratégico: Construir la base administrativa que permitirá aislar información por cliente y habilitar el portal de nómina de forma segura.

---

# 🎯 1. OBJETIVO DEL HITO

Implementar el módulo de clientes garantizando:

- Registro estructurado de clientes.
- Aislamiento de datos por cliente.
- Activación y desactivación sin eliminación física.
- Generación de token único y seguro para acceso al portal.

Este hito prepara la estructura necesaria para el Portal de Nómina (Hito 4).

---

# 🛠 2. TAREAS DEL HITO

## Diseño y Base de Datos
- Crear tabla `clients`.
- Definir campos mínimos:
  - id (UUID)
  - nombre (obligatorio)
  - RFC (obligatorio)
  - clave_patronal (opcional)
  - portal_token (único)
  - is_active
  - created_at
  - updated_at
  - created_by
- Definir índice único para RFC.
- Definir índice único para portal_token.
- Crear migración estable del módulo clientes.

## Lógica de Negocio
- CRUD completo de clientes.
- Validar que nombre y RFC sean obligatorios.
- Impedir eliminación física.
- Implementar activación / desactivación.
- Generar token largo, aleatorio y no predecible.
- Implementar regeneración de token (invalidar anterior).

## Seguridad
- Configurar RLS para:
  - Aislar datos por cliente cuando sea necesario.
  - Permitir acceso administrativo global.
- Validar que clientes desactivados no puedan usar portal.
- Verificar que token regenerado invalide accesos anteriores.

## Interfaz de Usuario
- Vista de listado de clientes.
- Vista de detalle.
- Formulario de alta y edición.
- Botón de activar / desactivar.
- Botón de regenerar token.
- Visualización controlada del token (no exponer innecesariamente).

## Pruebas
- Probar creación y edición.
- Probar desactivación sin pérdida de datos.
- Probar regeneración de token.
- Verificar que el token anterior ya no funcione.
- Probar aislamiento de datos.

---

# ⚙️ 3. REQUERIMIENTOS TÉCNICOS

- Prisma para migración del módulo.
- Uso de UUID seguros.
- Generación criptográficamente segura de tokens.
- Índices en RFC y portal_token.
- RLS configurado correctamente.
- No eliminación física (soft delete mediante estado).
- Manejo consistente de estados (activo / inactivo).

---

# 📌 4. REQUERIMIENTOS FUNCIONALES

- Crear cliente con nombre y RFC obligatorios.
- RFC no puede duplicarse.
- Cliente puede desactivarse pero no eliminarse.
- Cliente desactivado conserva historial.
- Sistema genera automáticamente un token único.
- Token puede regenerarse manualmente.
- Token anterior queda inválido.
- Solo usuarios autenticados pueden administrar clientes.

---

# ✅ 5. DEFINITION OF DONE (DoD)

El Hito 3 se considera terminado cuando:

- Tabla `clients` está migrada y estable.
- No es posible duplicar RFC.
- No es posible eliminar físicamente clientes.
- Activación y desactivación funcionan correctamente.
- Token generado es largo, único y seguro.
- Regeneración invalida el token anterior.
- RLS impide accesos indebidos.
- No existen errores críticos en pruebas manuales.
- El sistema está listo para conectar el Portal de Nómina.

---

# 🎯 Resultado Esperado

Al finalizar este hito:

- El sistema tiene una base administrativa sólida.
- Existe aislamiento estructural por cliente.
- Está listo el mecanismo de acceso seguro al portal externo.
- El proyecto está preparado para iniciar el Hito 4 (Portal de Nómina).

