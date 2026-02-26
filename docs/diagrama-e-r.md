erDiagram

    clients ||--|{ employees : "1..N"
    clients ||--o{ payroll_events : "0..N"
    clients ||--|{ receipts : "1..N"

    employees ||--|{ payroll_events : "1..N"

    users ||--o{ tasks : "creates 0..N"
    users ||--o{ tasks : "assigned 0..N"
    users ||--o{ comments : "0..N"
    users ||--o{ monthly_activities : "0..N"

    tasks ||--o{ subtasks : "0..N"
    tasks ||--o{ comments : "0..N"

    receipts ||--|{ receipt_items : "1..N"
    concepts ||--o{ receipt_items : "0..N"

    clients {
        uuid id PK
        varchar name
        varchar portal_token
        boolean is_active
    }

    employees {
        uuid id PK
        uuid client_id FK

        varchar employee_number
        varchar first_name
        varchar last_name
        varchar mother_last_name

        varchar rfc
        varchar curp
        varchar nss

        varchar street
        varchar exterior_number
        varchar interior_number
        varchar neighborhood
        varchar municipality
        varchar state
        varchar postal_code
        varchar country

        date hire_date
        date termination_date
        varchar employment_status
        varchar contract_type
        varchar position
        varchar department
        varchar salary_type
        numeric daily_salary
        numeric integrated_daily_salary

        varchar bank_name
        varchar bank_account
        varchar clabe

        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    payroll_events {
        uuid id PK
        uuid employee_id FK
        uuid client_id FK
        varchar event_type
        date start_date
        date end_date
        timestamptz created_at
    }

    users {
        uuid id PK
        varchar email
        varchar full_name
        varchar role
        varchar status
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    tasks {
        uuid id PK
        varchar title
        text description
        uuid created_by FK
        uuid assigned_to FK
        date due_date
        varchar status
        boolean is_urgent
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    subtasks {
        uuid id PK
        uuid task_id FK
        varchar title
        boolean is_completed
        timestamptz created_at
    }

    comments {
        uuid id PK
        uuid task_id FK
        uuid user_id FK
        text content
        timestamptz created_at
    }

    monthly_activities {
        uuid id PK
        uuid user_id FK
        varchar title
        integer day_of_month
        boolean is_active
        timestamptz created_at
    }

    receipts {
        uuid id PK
        uuid client_id FK
        integer folio
        date issue_date
        numeric total_amount
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    receipt_items {
        uuid id PK
        uuid receipt_id FK
        uuid concept_id FK
        varchar description
        numeric quantity
        numeric unit_price
        numeric subtotal
    }

    concepts {
        uuid id PK
        varchar name
        boolean is_active
        timestamptz created_at
    }