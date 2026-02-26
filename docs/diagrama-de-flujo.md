flowchart TD

%% =========================
%% AUTENTICACIÓN
%% =========================

A[Usuario entra a la app] --> B{¿Está autenticado?}

B -- No --> C[Login / Supabase Auth]
C --> D{Credenciales válidas?}
D -- No --> C
D -- Sí --> E[Dashboard Principal]

B -- Sí --> E[Dashboard Principal]

%% =========================
%% DASHBOARD
%% =========================

E --> F{Selecciona módulo}

F --> G[Clientes]
F --> H[Empleados]
F --> I[Eventos Nómina]
F --> J[Tareas Internas]
F --> K[Recibos]
F --> L[Portal Cliente]

%% =========================
%% CLIENTES
%% =========================

G --> G1[Crear cliente]
G --> G2[Editar cliente]
G --> G3[Desactivar cliente]
G1 --> E
G2 --> E
G3 --> E

%% =========================
%% EMPLEADOS
%% =========================

H --> H0[Seleccionar Cliente]
H0 --> H1[Listar empleados]
H1 --> H2[Alta empleado]
H1 --> H3[Editar empleado]
H1 --> H4[Dar de baja]

H2 --> H5[Validar datos RFC/CURP/NSS]
H5 --> H6[Guardar empleado]
H6 --> E

H3 --> H6
H4 --> H6

%% =========================
%% EVENTOS DE NÓMINA
%% =========================

I --> I0[Seleccionar Cliente]
I0 --> I1[Seleccionar Empleado]
I1 --> I2[Crear Evento]
I2 --> I3{Tipo de evento}

I3 --> |Alta| I4[Registrar fecha inicio]
I3 --> |Baja| I5[Registrar fecha fin]
I3 --> |Vacaciones| I6[Registrar periodo]
I3 --> |Incapacidad| I7[Registrar periodo]

I4 --> I8[Guardar evento]
I5 --> I8
I6 --> I8
I7 --> I8

I8 --> E

%% =========================
%% TAREAS INTERNAS
%% =========================

J --> J1[Crear tarea]
J --> J2[Asignar usuario]
J --> J3[Agregar subtareas]
J --> J4[Agregar comentarios]
J --> J5[Marcar completada]

J1 --> E
J2 --> E
J3 --> E
J4 --> E
J5 --> E

%% =========================
%% RECIBOS
%% =========================

K --> K0[Seleccionar Cliente]
K0 --> K1[Crear recibo]
K1 --> K2[Agregar conceptos]
K2 --> K3[Calcular totales]
K3 --> K4[Guardar recibo]
K4 --> K5[Generar PDF]
K5 --> E

%% =========================
%% PORTAL CLIENTE
%% =========================

L --> L1[Cliente accede con token]
L1 --> L2[Ver recibos]
L1 --> L3[Descargar PDF]
L1 --> L4[Consultar empleados activos]

L2 --> L
L3 --> L
L4 --> L