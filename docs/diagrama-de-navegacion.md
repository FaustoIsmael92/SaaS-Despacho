flowchart TD

%% PÚBLICO

Landing["Landing (/ )"] --> Login["Login (/login)"]
Landing --> Registro["Registro (/registro)"]
Landing --> PortalRoot["Portal Cliente (/portal/:token)"]

Login --> AuthCheck{Autenticación válida?}
AuthCheck -- No --> Login
AuthCheck -- Sí --> Dashboard["Dashboard (/dashboard)"]

%% DASHBOARD – LAYOUT CON SIDEBAR

Dashboard --> Sidebar["Sidebar: Dashboard · Clientes · Recibos · Nómina · Config · Cuenta"]

Sidebar --> Clientes["Clientes (/clientes)"]
Sidebar --> Recibos["Recibos (/recibos)"]
Sidebar --> Nomina["Nómina (/nomina)"]
Sidebar --> DashboardUsuarios["Usuarios (/dashboard/usuarios)"]

%% CLIENTES

Clientes --> ClientesView["Vista: listado + formulario + edición en modal"]

%% RECIBOS

Recibos --> RecibosView["Vista: filtros, tabla 1 fila por concepto, PDF, edición"]

%% NÓMINA

Nomina --> NominaView["Vista: selector cliente, registros, Generar link portal"]
NominaView --> PortalLink["Link portal para cliente"]

%% TAREAS (desde el propio Dashboard)

Dashboard --> Tasks["Tareas (/tasks)"]
Tasks --> TaskNew["Nueva Tarea (/tasks/new)"]
Tasks --> TaskDetail["Detalle Tarea (/tasks/:id)"]
TaskDetail --> TaskEdit["Editar Tarea (/tasks/:id/edit)"]

%% PORTAL CLIENTE (por token)

PortalRoot --> PortalEmployees["Empleados (/portal/:token)"]
PortalRoot --> PortalAlta["Alta empleado (/portal/:token/alta)"]
PortalRoot --> PortalBaja["Baja empleado (/portal/:token/baja)"]
PortalRoot --> PortalIncapacidad["Incapacidad (/portal/:token/incapacidad)"]
PortalRoot --> PortalVacaciones["Vacaciones (/portal/:token/vacaciones)"]
PortalRoot --> PortalReactivar["Reactivar empleado (/portal/:token/reactivate)"]
