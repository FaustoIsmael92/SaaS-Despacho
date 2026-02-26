# ESPECIFICACIÓN COMPLETA DE TABLAS
## MVP – ERP Interno Despacho Contable

Este documento define cada tabla del sistema con:
- Tipo de dato PostgreSQL
- Restricciones
- Nullabilidad
- Índices
- Reglas de negocio
- Consideraciones de seguridad

---

# 1️⃣ TABLA: users

## Descripción
Usuarios internos del despacho.

## Estructura
- id → uuid (PK, NOT NULL, default gen_random_uuid())
- email → varchar(255) (NOT NULL, UNIQUE, INDEX)
- full_name → varchar(150) (NOT NULL)
- role → varchar(20) (NOT NULL, CHECK role IN ('admin','user'))
- status → varchar(20) (NOT NULL, CHECK status IN ('pending','active'))
- is_active → boolean (NOT NULL, default true)
- created_at → timestamptz (NOT NULL, default now())
- updated_at → timestamptz (NOT NULL, auto-update trigger)

## Índices
- UNIQUE(email)

## Seguridad
- RLS obligatorio
- Solo admin puede cambiar role

---

# 2️⃣ TABLA: clients

## Descripción
Clientes del despacho.

## Estructura
- id → uuid (PK, NOT NULL)
- name → varchar(200) (NOT NULL)
- email → varchar(255) (NULL)
- phone → varchar(20) (NULL)
- portal_token → varchar(255) (NOT NULL, UNIQUE, INDEX)
- is_active → boolean (NOT NULL, default true)
- created_at → timestamptz (NOT NULL, default now())
- updated_at → timestamptz (NOT NULL)

## Índices
- UNIQUE(portal_token)

## Seguridad
- Token mínimo 128 bits
- Regenerable

---

# 3️⃣ TABLA: employees

## Descripción
Empleados registrados por cliente.

## Estructura
- id → uuid (PK, NOT NULL)
- client_id → uuid (FK → clients.id, NOT NULL, INDEX)

### Identidad
- employee_number → varchar(50) (NULL, INDEX opcional)
- first_name → varchar(100) (NOT NULL)
- last_name → varchar(100) (NOT NULL)
- mother_last_name → varchar(100) (NULL)

### Datos sensibles (cifrado a nivel aplicación)
- rfc → varchar(20) (NOT NULL)
- curp → varchar(20) (NOT NULL)
- nss → varchar(20) (NOT NULL)

### Domicilio
- street → varchar(150)
- exterior_number → varchar(20)
- interior_number → varchar(20)
- neighborhood → varchar(150)
- municipality → varchar(150)
- state → varchar(150)
- postal_code → varchar(10) (NOT NULL)
- country → varchar(100) (NOT NULL default 'México')

### Laboral
- hire_date → date (NOT NULL)
- termination_date → date (NULL)
- employment_status → varchar(30) (NOT NULL CHECK IN ('activo','baja','suspendido'))
- contract_type → varchar(50)
- position → varchar(150)
- department → varchar(150)
- salary_type → varchar(30) (CHECK IN ('diario','mensual'))
- daily_salary → numeric(12,2)
- integrated_daily_salary → numeric(12,2)

### Bancarios (cifrado)
- bank_name → varchar(150)
- bank_account → varchar(50)
- clabe → varchar(18)

### Control
- is_active → boolean (NOT NULL default true)
- created_at → timestamptz (NOT NULL default now())
- updated_at → timestamptz
- created_by → uuid (FK → users.id)

## Índices
- INDEX(client_id)
- INDEX(client_id, rfc)
- INDEX(client_id, curp)

## Seguridad
- RLS por client_id
- Cifrado obligatorio RFC, CURP, NSS, CLABE

---

# 4️⃣ TABLA: payroll_events

## Descripción
Eventos históricos de nómina.

## Estructura
- id → uuid (PK)
- employee_id → uuid (FK → employees.id, NOT NULL, INDEX)
- client_id → uuid (FK → clients.id, NOT NULL, INDEX)
- event_type → varchar(30) (NOT NULL CHECK IN ('alta','baja','incapacidad','vacaciones'))
- start_date → date (NOT NULL)
- end_date → date (NULL)
- notes → text
- created_at → timestamptz (NOT NULL default now())
- created_by → uuid (FK → users.id, NULL)

## Seguridad
- RLS por client_id

---

# 5️⃣ TABLA: tasks

## Descripción
Sistema interno de tareas.

## Estructura
- id → uuid (PK)
- title → varchar(200) (NOT NULL)
- description → text
- created_by → uuid (FK → users.id, NOT NULL)
- assigned_to → uuid (FK → users.id, NOT NULL, INDEX)
- due_date → date (NULL)
- status → varchar(30) (NOT NULL CHECK IN ('pending','completed'))
- is_urgent → boolean (NOT NULL default false)
- is_active → boolean (NOT NULL default true)
- created_at → timestamptz (NOT NULL default now())
- updated_at → timestamptz

## Índices
- INDEX(assigned_to)
- INDEX(due_date)

---

# 6️⃣ TABLA: subtasks

- id → uuid (PK)
- task_id → uuid (FK → tasks.id, NOT NULL, INDEX)
- title → varchar(200) (NOT NULL)
- is_completed → boolean (NOT NULL default false)
- created_at → timestamptz (NOT NULL default now())

---

# 7️⃣ TABLA: comments

- id → uuid (PK)
- task_id → uuid (FK → tasks.id, NOT NULL)
- user_id → uuid (FK → users.id, NOT NULL)
- content → text (NOT NULL)
- created_at → timestamptz (NOT NULL default now())

---

# 8️⃣ TABLA: monthly_activities

- id → uuid (PK)
- user_id → uuid (FK → users.id, NOT NULL)
- title → varchar(200) (NOT NULL)
- day_of_month → integer (NOT NULL CHECK BETWEEN 1 AND 31)
- is_active → boolean (NOT NULL default true)
- created_at → timestamptz (NOT NULL default now())

---

# 9️⃣ TABLA: receipts

- id → uuid (PK)
- client_id → uuid (FK → clients.id, NOT NULL, INDEX)
- folio → integer (NOT NULL UNIQUE)
- issue_date → date (NOT NULL)
- total_amount → numeric(12,2) (NOT NULL)
- notes → text
- is_active → boolean (NOT NULL default true)
- created_at → timestamptz (NOT NULL default now())
- updated_at → timestamptz

---

# 🔟 TABLA: receipt_items

- id → uuid (PK)
- receipt_id → uuid (FK → receipts.id, NOT NULL, INDEX)
- concept_id → uuid (FK → concepts.id, NOT NULL)
- description → varchar(255)
- quantity → numeric(10,2) (NOT NULL)
- unit_price → numeric(10,2) (NOT NULL)
- subtotal → numeric(12,2) (NOT NULL)

---

# 1️⃣1️⃣ TABLA: concepts

- id → uuid (PK)
- name → varchar(150) (NOT NULL UNIQUE)
- is_active → boolean (NOT NULL default true)
- created_at → timestamptz (NOT NULL default now())

---

# CONSIDERACIONES GLOBALES

- Todas las tablas sensibles tendrán RLS habilitado.
- No existe eliminación física en clients, employees ni receipts.
- Campos sensibles cifrados a nivel aplicación.
- Índices optimizados para consultas por cliente y asignación de tareas.
- Migraciones controladas mediante Prisma.

---

Este documento representa la estructura definitiva previa a la generación del schema.prisma.

