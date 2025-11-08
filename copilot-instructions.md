AI Code Generation Specifications: Employee Management & Timesheet System (Java Spring Boot)

# Introduction

1.1. Overview

This document outlines the functional and non-functional requirements for an AI to generate a comprehensive web-based Employee Management System (EMS). The primary goal is to generate a full-stack application that centralizes employee data, streamlines project-based timesheet submission, and automates the client invoicing process.

The AI will generate all necessary code, including the backend API, the frontend web application, database schema, and deployment configurations based on the specifications below.

1.2. Core Objectives for the Generated Application

To create a single source of truth for all employee, client, and project data.

To automate and simplify the process of tracking employee hours against specific projects and clients.

To establish a clear and efficient workflow for timesheet approval by managers.

To build a robust invoicing module that generates client invoices from approved timesheet data and tracks payments.

To implement a notification system for missing timesheets.

To ensure the generated application is secure, scalable, and user-friendly.

# Core Technology Stack (Mandatory)

The AI must generate the application using the following technologies:

Frontend: React

Use functional components with React Hooks.

Use React Context or Zustand for state management.

Use a modern UI library like shadcn/ui or Tailwind CSS for styling.

Use axios for API communication.

Backend: Spring Boot (Java)

Use Spring Boot 3 with Java 21.

Use Spring Web for REST controllers and JSON serialization (Jackson).

Use Spring Data JPA (Hibernate) for persistence.

Use Bean Validation (jakarta.validation) for request/response validation.

Use Spring Security with JWT for authentication and RBAC authorization.

Use MapStruct or manual mappers for DTO to entity mapping.

Database: Postgresql

The AI will generate the complete CREATE TABLE scripts as specified in Section 5.3.

Deployment: Azure & AWS Cloud (Require both deployment types)

The AI will generate Dockerfile and docker-compose.yml for containerization.

The AI will generate main.bicep(for azure) and appropriate file for AWS for provisioning necessary Azure and AWS resources (e.g., Azure App Service / AWS Equivalent, Azure/AWS Database for Postgresql).

# User Roles & Permissions

Generate code to support three primary user roles:

3.1. Employee

View/Edit Profile: Can view their own profile and edit personal information (contact details, address).

Timesheets:

Can create, save (as draft), and submit their own weekly timesheets.

When adding time, must select a Client and Project for each entry.

Can categorize time as Billable, Non-Billable, PTO, or Sick Leave.

Can view the status (Draft, Submitted, Approved, Rejected) and history of their own timesheets.

Dashboard: Sees a personal dashboard with timesheet status, pending actions, and PTO balance.

3.2. Manager

Inherits: All "Employee" permissions.

Team View: Can view the profiles of their direct reports.

Timesheet Approval:

Receives notifications for pending timesheet submissions from their team.

Can review timesheets, which must display a clear breakdown of hours by project/client.

Can approve or reject (with mandatory comments) submitted timesheets.

Reporting: Can view and generate reports for their team (total hours, hours per project).

3.3. Administrator

Inherits: All "Manager" permissions.

Full CRUD: Full Create, Read, Update, Delete access over all employee profiles.

Client & Project Management (CRUD):

Can create, read, update, and delete Clients.

Can create, read, update, and delete Projects and assign them to clients.

Can assign employees to specific projects.

System Configuration: Can manage departments, job titles, and user roles.

Invoice Management (Full Access):

Can generate invoices for any client based on approved, billable hours.

Can track invoice status (Draft, Sent, Paid, Overdue).

Can record and consolidate payments against invoices.

Reporting: Can generate all system-wide reports, including timesheet, employee, and invoice reports.

## Functional Requirements (Modules for AI Generation)

4.1. Module: Authentication

Generate secure login (email/password) and logout functionality.

Implement JWT (JSON Web Token) for managing authenticated sessions using Spring Security.

Generate a "Forgot Password" workflow (token-based email flow, endpoints and persistence).

4.2. Module: Dashboard

Employee View: Widgets for "Current Timesheet Status," "My Projects," and "My PTO Balance."

Manager View: Adds widgets for "Pending Timesheet Approvals" and "Team Project Hours."

Admin View: Adds widgets for "System-Wide Timesheet Status," "Overdue Invoices," and "Monthly Revenue."

4.3. Module: Client & Project Management (Admin)

Generate a UI for Admins to perform full CRUD operations on Clients (Fields: Client Name, Contact Person, Email, Address).

Generate a UI for Admins to perform full CRUD operations on Projects (Fields: Project Name, Client [links to Client], Default Billable Rate, Status [Active/Inactive]).

Generate a UI for Admins to assign/unassign employees to projects.

4.4. Module: Employee Management (Admin)

Generate a searchable/filterable directory of all employees.

Generate forms for creating and editing employee profiles (Fields: Name, Email, Job Title, Department, Reports to [Manager], Hire Date, Role).

4.5. Module: Profile Management (Employee)

Generate a "My Profile" page where employees can edit personal contact info.

4.6. Module: Timesheet Management

Timesheet View: Generate a grid-based view for a 7-day week (Sunday-Saturday).

Data Entry (Employee):

For each day, the user must be able to add multiple time entries.

Each entry form must include:

Client (Dropdown, populated from assigned projects)

Project (Dropdown, filtered by selected client)

Task Type (Dropdown: Billable, Non-Billable, PTO, Sick)

Hours (Input)

Notes (Textarea)

Generate auto-calculation for daily and weekly total hours.

Actions (Employee): Generate "Save as Draft" and "Submit for Approval" buttons. Submission must lock the timesheet.

Rejection Handling: If rejected, the timesheet status changes, and it becomes editable again, displaying the manager's rejection comments.

4.7. Module: Timesheet Approval (Manager)

Generate an "Approval Queue" page for managers.

The review modal must show a detailed breakdown of all time entries, including project, task type, and notes.

Generate "Approve" and "Reject" (with reason) buttons.

4.8. Module: Reporting (Admin/Manager)

Total Hours Report:

Generate a report page filterable by Employee, Client, Project, and Date Range.

Display total hours for each employee for the given period, with a breakdown by project and task type.

Timesheet Status Report:

Generate a report showing the status (Draft, Submitted, Approved) of all timesheets for a selected pay period.

Invoice Report:

Generate a report of all invoices, filterable by Client, Status (Draft, Sent, Paid), and Date Range.

Payment Tracking Report:

Generate a report showing all received payments, consolidated by client.

Export: All reports must have a button to export the data as a CSV file.

4.9. Module: Alerts & Notifications

To Employees:

Generate an alert email (weekly) for employees who have not submitted their timesheet by the deadline (e.g., Friday 5 PM).

Generate in-app and email alerts when their timesheet is approved or rejected.

To Managers:

Generate in-app and email alerts when an employee submits a timesheet.

To Admins:

Generate a dashboard widget and/or weekly email alert listing all employees with missing (un-submitted) timesheets.

4.10. Module: Invoice Generation & Tracking (Admin)

Invoice Generator:

Generate a page where an Admin can select a Client and a Date Range (Weekly, Monthly, Custom).

The system must fetch all approved and billable time entries for that client.

Generate an invoice with:

Client details.

Line items grouped by Project and then by Employee, showing Hours x Rate = Line Total.

A final Total Amount Due.

Allow the invoice to be saved as a Draft.

Invoice Tracking:

Generate an "Invoices" page listing all generated invoices.

Admin can change invoice status (Draft -> Sent -> Paid / Overdue).

Admin can "Record Payment" against an invoice, allowing for partial or full payments (consolidating payments).

## AI Generation Directives & Database Schema

5.1. Backend (Spring Boot) Structure

Generate a modular Spring Boot structure (Java 21, Maven or Gradle):

src/main/java/com/company/ems/
  api/          (REST controllers, request/response DTOs)
  service/      (application services/use cases)
  repository/   (Spring Data JPA repositories)
  domain/       (JPA entities, value objects)
  mapper/       (MapStruct or manual mappers)
  security/     (JWT, RBAC, SecurityConfig)
  config/       (application-level config, OpenAPI, Flyway)

Key requirements:

- Controllers return DTOs and use Bean Validation for inputs.
- Services encapsulate business logic and transactions (@Transactional).
- Repositories are Spring Data JPA interfaces; custom queries as needed.
- Security: Spring Security JWT (login/register endpoints), BCrypt password hashing, method-level authorization with @PreAuthorize.
- Error handling: Global @ControllerAdvice producing RFC 7807 ProblemDetail.
- OpenAPI via springdoc-openapi; Actuator for /actuator/health and /actuator/info.
- Dockerfile and docker-compose.yml (app + postgres).

5.2. Frontend (React) Structure

Generate a standard Create React App structure:

src/components/: Reusable UI components (Button, Input, Modal, etc.).

src/pages/: Top-level page components (Dashboard, Timesheet, Invoices, etc.).

src/services/: API client (axios) functions (e.g., api.js, timesheetService.js).

src/context/: React Context for global state (e.g., AuthContext, UserContext).

src/hooks/: Custom hooks (e.g., useAuth.js).

5.3. Database Schema (Postgresql)

Generate the following CREATE TABLE script:

CREATE TABLE users (
id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
email VARCHAR(255) NOT NULL UNIQUE,
hashed_password VARCHAR(255) NOT NULL,
first_name VARCHAR(100),
last_name VARCHAR(100),
role VARCHAR(50) NOT NULL,
reports_to_manager_id INT,
is_active BOOLEAN DEFAULT TRUE,
hire_date DATE,
department VARCHAR(100),
job_title VARCHAR(100),
CONSTRAINT fk_users_manager FOREIGN KEY (reports_to_manager_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE clients (
id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
name VARCHAR(255) NOT NULL,
contact_person VARCHAR(255),
contact_email VARCHAR(255),
address TEXT
);

CREATE TABLE projects (
id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
name VARCHAR(255) NOT NULL,
client_id INT NOT NULL,
default_billable_rate NUMERIC(10, 2) NOT NULL,
status VARCHAR(20) DEFAULT 'active',
CONSTRAINT fk_projects_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE project_assignments (
id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
user_id INT NOT NULL,
project_id INT NOT NULL,
UNIQUE(user_id, project_id),
CONSTRAINT fk_pa_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
CONSTRAINT fk_pa_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE timesheets (
id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
user_id INT NOT NULL,
week_start_date DATE NOT NULL,
status VARCHAR(20) NOT NULL DEFAULT 'draft',
submitted_at TIMESTAMP,
approved_at TIMESTAMP,
rejection_comments TEXT,
UNIQUE(user_id, week_start_date),
CONSTRAINT fk_timesheets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE time_entries (
id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
timesheet_id INT NOT NULL,
project_id INT,
entry_date DATE NOT NULL,
hours NUMERIC(4, 2) NOT NULL,
task_type VARCHAR(20) NOT NULL,
notes TEXT,
CONSTRAINT fk_te_timesheet FOREIGN KEY (timesheet_id) REFERENCES timesheets(id) ON DELETE CASCADE,
CONSTRAINT fk_te_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

CREATE TABLE invoices (
id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
client_id INT NOT NULL,
issue_date DATE NOT NULL,
due_date DATE NOT NULL,
status VARCHAR(20) NOT NULL DEFAULT 'draft',
total_amount NUMERIC(10, 2) NOT NULL,
amount_paid NUMERIC(10, 2) DEFAULT 0.00,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_invoices_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE RESTRICT
);

CREATE TABLE invoice_line_items (
id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
invoice_id INT NOT NULL,
project_id INT,
user_id INT,
description TEXT,
hours NUMERIC(10, 2) NOT NULL,
rate NUMERIC(10, 2) NOT NULL,
line_total NUMERIC(10, 2) NOT NULL,
CONSTRAINT fk_ili_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
CONSTRAINT fk_ili_project FOREIGN KEY (project_id) REFERENCES projects(id),
CONSTRAINT fk_ili_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE payments (
id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
invoice_id INT NOT NULL,
payment_date DATE NOT NULL,
amount NUMERIC(10, 2) NOT NULL,
method VARCHAR(50),
notes TEXT,
CONSTRAINT fk_payments_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

## Non-Functional Requirements

Security: Implement role-based access control (RBAC) at the API level using Spring Security. Hash passwords with BCrypt. Use HTTPS.

Usability: Generate a clean, responsive, and modern UI.

Performance: All API queries must be optimized. Paginate large data sets (e.g., reports, directories).

## Future Enhancements (v2.0)

Payroll Integration

Formal Leave Management Module (Request/Approve PTO)

Native Mobile App Integration (React Native)
