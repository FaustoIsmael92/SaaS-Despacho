flowchart TD

%% PUBLIC

Landing["Landing Page (/ )"] --> Login["Login (/login)"]
Landing --> PortalRoot["Portal Cliente (/portal/:token)"]

Login --> AuthCheck{Autenticación válida?}
AuthCheck -- No --> Login
AuthCheck -- Sí --> Dashboard["Dashboard (/dashboard)"]

%% DASHBOARD NAVIGATION

Dashboard --> Clients["Clientes (/clients)"]
Dashboard --> Employees["Empleados (/employees)"]
Dashboard --> Payroll["Eventos Nómina (/payroll-events)"]
Dashboard --> Tasks["Tareas (/tasks)"]
Dashboard --> Receipts["Recibos (/receipts)"]
Dashboard --> Settings["Configuración (/settings)"]

%% CLIENTS

Clients --> ClientNew["Nuevo Cliente (/clients/new)"]
Clients --> ClientDetail["Detalle Cliente (/clients/:id)"]
ClientDetail --> ClientEdit["Editar Cliente (/clients/:id/edit)"]

%% EMPLOYEES

Employees --> EmployeeList["Lista por Cliente (?clientId=)"]
EmployeeList --> EmployeeNew["Nuevo Empleado (/employees/new)"]
EmployeeList --> EmployeeDetail["Detalle Empleado (/employees/:id)"]
EmployeeDetail --> EmployeeEdit["Editar Empleado (/employees/:id/edit)"]

%% PAYROLL EVENTS

Payroll --> PayrollList["Lista Eventos (?clientId=)"]
PayrollList --> PayrollNew["Nuevo Evento (/payroll-events/new)"]
PayrollList --> PayrollDetail["Detalle Evento (/payroll-events/:id)"]

%% TASKS

Tasks --> TaskNew["Nueva Tarea (/tasks/new)"]
Tasks --> TaskDetail["Detalle Tarea (/tasks/:id)"]
TaskDetail --> TaskEdit["Editar Tarea (/tasks/:id/edit)"]

%% RECEIPTS

Receipts --> ReceiptList["Lista por Cliente (?clientId=)"]
ReceiptList --> ReceiptNew["Nuevo Recibo (/receipts/new)"]
ReceiptList --> ReceiptDetail["Detalle Recibo (/receipts/:id)"]
ReceiptDetail --> ReceiptEdit["Editar Recibo (/receipts/:id/edit)"]
ReceiptDetail --> ReceiptPDF["Ver PDF (/receipts/:id/pdf)"]

%% SETTINGS

Settings --> SettingsUsers["Usuarios (/settings/users)"]
Settings --> SettingsConcepts["Conceptos (/settings/concepts)"]
Settings --> SettingsProfile["Perfil (/settings/profile)"]

%% PORTAL

PortalRoot --> PortalReceipts["Recibos Cliente (/portal/:token/receipts)"]
PortalReceipts --> PortalReceiptDetail["Detalle Recibo (/portal/:token/receipts/:id)"]
PortalRoot --> PortalEmployees["Empleados Activos (/portal/:token/employees)"]
