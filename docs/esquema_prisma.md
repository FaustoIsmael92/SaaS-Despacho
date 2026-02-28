generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "postgresql"
url      = env("DATABASE_URL")
}

//////////////////////////////////////////////////////
// ENUMS
//////////////////////////////////////////////////////

enum UserRole {
admin
user
}

enum UserStatus {
pending
active
}

enum EmploymentStatus {
activo
baja
suspendido
}

enum SalaryType {
diario
mensual
}

enum TaskStatus {
pending
completed
}

enum PayrollEventType {
alta
baja
incapacidad
vacaciones
}

//////////////////////////////////////////////////////
// USERS
//////////////////////////////////////////////////////

model User {
id        String   @id @default(uuid()) @db.Uuid
email     String   @unique @db.VarChar(255)
fullName  String   @db.VarChar(150)
role      UserRole
status    UserStatus
isActive  Boolean  @default(true)

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

// Relations
createdTasks   Task[]   @relation("TaskCreatedBy")
assignedTasks  Task[]   @relation("TaskAssignedTo")
comments       Comment[]
monthlyActivities MonthlyActivity[]
createdEmployees Employee[] @relation("EmployeeCreatedBy")
payrollEvents   PayrollEvent[] @relation("PayrollEventCreatedBy")
dashboardMessages DashboardMessage[]
}

//////////////////////////////////////////////////////
// CLIENTS
//////////////////////////////////////////////////////

model Client {
id             String   @id @default(uuid()) @db.Uuid
name           String   @db.VarChar(200)
rfc            String   @db.VarChar(20)
clavePatronal  String?  @map("clave_patronal") @db.VarChar(50)
email          String?  @db.VarChar(255)
phone          String?  @db.VarChar(20)
portalToken    String   @unique @map("portal_token") @db.VarChar(255)
isActive       Boolean  @default(true) @map("is_active")

createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")

employees     Employee[]
payrollEvents PayrollEvent[]
receipts      Receipt[]

@@index([rfc])
@@map("clients")
}

//////////////////////////////////////////////////////
// EMPLOYEES
//////////////////////////////////////////////////////

model Employee {
id        String   @id @default(uuid()) @db.Uuid
clientId  String   @db.Uuid
client    Client   @relation(fields: [clientId], references: [id])

employeeNumber String? @db.VarChar(50)

firstName       String  @db.VarChar(100)
lastName        String  @db.VarChar(100)
motherLastName  String? @db.VarChar(100)

// Sensitive (encrypted at app layer)
rfc   String @db.VarChar(20)
curp  String @db.VarChar(20)
nss   String @db.VarChar(20)

// Address
street          String? @db.VarChar(150)
exteriorNumber  String? @db.VarChar(20)
interiorNumber  String? @db.VarChar(20)
neighborhood    String? @db.VarChar(150)
municipality    String? @db.VarChar(150)
state           String? @db.VarChar(150)
postalCode      String  @db.VarChar(10)
country         String  @default("México") @db.VarChar(100)

// Employment
hireDate             DateTime
terminationDate      DateTime?
employmentStatus     EmploymentStatus
contractType         String? @db.VarChar(50)
position             String? @db.VarChar(150)
department           String? @db.VarChar(150)
salaryType           SalaryType?
dailySalary          Decimal? @db.Decimal(12, 2)
integratedDailySalary Decimal? @db.Decimal(12, 2)

// Banking (encrypted at app layer)
bankName     String? @db.VarChar(150)
bankAccount  String? @db.VarChar(50)
clabe        String? @db.VarChar(18)

isActive  Boolean  @default(true)

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

createdById String? @db.Uuid
createdBy   User?   @relation("EmployeeCreatedBy", fields: [createdById], references: [id])

payrollEvents PayrollEvent[]

@@index([clientId])
@@index([clientId, rfc])
@@index([clientId, curp])
}

//////////////////////////////////////////////////////
// DASHBOARD MESSAGES (chat fijable)
//////////////////////////////////////////////////////

model DashboardMessage {
id       String   @id @default(uuid()) @db.Uuid
userId   String   @map("user_id") @db.Uuid
user     User     @relation(fields: [userId], references: [id])
content  String   @db.VarChar(2000)
isPinned Boolean  @default(false) @map("is_pinned")
createdAt DateTime @default(now()) @map("created_at")

@@index([userId])
@@index([isPinned])
@@map("dashboard_messages")
}

//////////////////////////////////////////////////////
// PAYROLL EVENTS
//////////////////////////////////////////////////////

model PayrollEvent {
id         String   @id @default(uuid()) @db.Uuid
employeeId String   @db.Uuid
clientId   String   @db.Uuid

employee   Employee @relation(fields: [employeeId], references: [id])
client     Client   @relation(fields: [clientId], references: [id])

eventType  PayrollEventType
startDate  DateTime
endDate    DateTime?
notes      String?

createdAt  DateTime @default(now())

createdById String? @db.Uuid
createdBy   User?   @relation("PayrollEventCreatedBy", fields: [createdById], references: [id])

@@index([employeeId])
@@index([clientId])
}

//////////////////////////////////////////////////////
// TASKS
//////////////////////////////////////////////////////

model Task {
id          String   @id @default(uuid()) @db.Uuid
title       String   @db.VarChar(200)
description String?

createdById  String
assignedToId String

createdBy  User @relation("TaskCreatedBy", fields: [createdById], references: [id])
assignedTo User @relation("TaskAssignedTo", fields: [assignedToId], references: [id])

dueDate   DateTime?
status    TaskStatus
isUrgent  Boolean   @default(false)
isActive  Boolean   @default(true)

monthlyActivityId String? @map("monthly_activity_id") @db.Uuid
monthlyActivity   MonthlyActivity? @relation(fields: [monthlyActivityId], references: [id])

createdAt DateTime  @default(now()) @map("created_at")
updatedAt DateTime  @updatedAt @map("updated_at")

subtasks Subtask[]
comments Comment[]

@@index([assignedToId])
@@index([dueDate])
@@index([isActive])
@@map("tasks")
}

//////////////////////////////////////////////////////
// SUBTASKS
//////////////////////////////////////////////////////

model Subtask {
id        String   @id @default(uuid()) @db.Uuid
taskId    String   @db.Uuid
task      Task     @relation(fields: [taskId], references: [id])

title       String  @db.VarChar(200)
isCompleted Boolean @default(false)

createdAt DateTime @default(now())

@@index([taskId])
}

//////////////////////////////////////////////////////
// COMMENTS
//////////////////////////////////////////////////////

model Comment {
id      String @id @default(uuid()) @db.Uuid
taskId  String @db.Uuid
userId  String @db.Uuid

task Task @relation(fields: [taskId], references: [id])
user User @relation(fields: [userId], references: [id])

content   String
createdAt DateTime @default(now())
}

//////////////////////////////////////////////////////
// MONTHLY ACTIVITIES
//////////////////////////////////////////////////////

model MonthlyActivity {
id         String  @id @default(uuid()) @db.Uuid
userId     String  @map("user_id") @db.Uuid
user       User    @relation(fields: [userId], references: [id])

title       String  @db.VarChar(200)
dayOfMonth  Int     @map("day_of_month")
isActive    Boolean @default(true) @map("is_active")

createdAt   DateTime @default(now()) @map("created_at")

tasks Task[]

@@map("monthly_activities")
}

//////////////////////////////////////////////////////
// RECEIPTS
//////////////////////////////////////////////////////

model Receipt {
id        String  @id @default(uuid()) @db.Uuid
clientId  String  @db.Uuid
client    Client  @relation(fields: [clientId], references: [id])

folio      Int     @unique
issueDate  DateTime
totalAmount Decimal @db.Decimal(12, 2)

notes     String?
isActive  Boolean @default(true)

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

items ReceiptItem[]

@@index([clientId])
}

//////////////////////////////////////////////////////
// RECEIPT ITEMS
//////////////////////////////////////////////////////

model ReceiptItem {
id        String @id @default(uuid()) @db.Uuid
receiptId String @db.Uuid
conceptId String @db.Uuid

receipt Receipt @relation(fields: [receiptId], references: [id])
concept Concept @relation(fields: [conceptId], references: [id])

description String? @db.VarChar(255)
quantity    Decimal @db.Decimal(10, 2)
unitPrice   Decimal @db.Decimal(10, 2)
subtotal    Decimal @db.Decimal(12, 2)

@@index([receiptId])
}

//////////////////////////////////////////////////////
// CONCEPTS
//////////////////////////////////////////////////////

model Concept {
id       String  @id @default(uuid()) @db.Uuid
name     String  @unique @db.VarChar(150)
isActive Boolean @default(true)

createdAt DateTime @default(now())

receiptItems ReceiptItem[]
}