# Employee Management & Timesheet System

A comprehensive full-stack web application for managing employees, tracking time, approving timesheets, and generating client invoices.

## 🚀 Features

### Core Functionality
- **Employee Management**: Full CRUD operations for employee profiles with role-based access
- **Timesheet Tracking**: Weekly timesheet submission with project/client association
- **Approval Workflow**: Manager approval/rejection of submitted timesheets with comments
- **Client & Project Management**: Manage clients and projects with billable rates
- **Invoice Generation**: Automated invoice creation from approved billable hours
- **Payment Tracking**: Record and track client payments against invoices
- **Role-Based Access Control**: Three user roles (Employee, Manager, Admin) with specific permissions

### Technical Features
- JWT-based authentication
- RESTful API with comprehensive validation
- Responsive modern UI with Tailwind CSS
- PostgreSQL database with Flyway migrations
- Docker containerization
- Cloud deployment ready (Azure & AWS)

## 📋 Technology Stack

### Backend
- **Java 21** with **Spring Boot 3.2**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with Hibernate
- **PostgreSQL** database
- **Flyway** for database migrations
- **Maven** for dependency management
- **OpenAPI/Swagger** for API documentation

### Frontend
- **React 18** with functional components and hooks
- **Vite** for fast development and building
- **React Router** for client-side routing
- **Zustand** for state management
- **Axios** for API communication
- **Tailwind CSS** for styling

### DevOps & Deployment
- **Docker** & **Docker Compose** for containerization
- **Azure Bicep** for Azure infrastructure as code
- **AWS CloudFormation** for AWS infrastructure
- **Nginx** for frontend serving

## 🏗️ Project Structure

```
payroll-processing/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/com/company/ems/
│   │   ├── api/               # REST controllers & DTOs
│   │   ├── service/           # Business logic
│   │   ├── repository/        # Data access layer
│   │   ├── domain/            # JPA entities
│   │   ├── mapper/            # DTO mappers
│   │   ├── security/          # JWT & security config
│   │   └── config/            # Application configuration
│   ├── src/main/resources/
│   │   ├── application.yml    # App configuration
│   │   └── db/migration/      # Flyway SQL scripts
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── store/             # Zustand store
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── infrastructure/             # Cloud deployment
│   ├── azure/                 # Azure Bicep templates
│   └── aws/                   # AWS CloudFormation
│
├── docker-compose.yml         # Local development
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- **Java 21** or higher
- **Node.js 18+** and **npm**
- **PostgreSQL 16** (or use Docker)
- **Docker** and **Docker Compose** (optional, for containerized setup)
- **Maven 3.9+**

### Option 1: Run with Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd payroll-processing
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:8080
   - API Documentation: http://localhost:8080/swagger-ui.html

### Option 2: Run Locally (Development)

#### Backend Setup

1. **Start PostgreSQL**
   ```bash
   docker run -d --name postgres \
     -e POSTGRES_DB=emsdb \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -p 5432:5432 \
     postgres:16-alpine
   ```

2. **Configure application**

   Update `backend/src/main/resources/application.yml` if needed.

3. **Build and run backend**
   ```bash
   cd backend
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

   Backend will start on `http://localhost:8080`

#### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

   Frontend will start on `http://localhost:3000`

## 👥 Default Users

After the application starts, create an admin user using the API or this SQL:

```sql
INSERT INTO users (email, hashed_password, first_name, last_name, role, is_active, hire_date)
VALUES (
  'admin@example.com',
  '$2a$10$CwTycUXWue0Thq9StjUM0uJ8V7UXJlJvgP.KVpvt4rC7rF/3kLHJa',  -- password: admin123
  'Admin',
  'User',
  'ROLE_ADMIN',
  true,
  CURRENT_DATE
);
```

## 🔐 Security

- Passwords hashed with **BCrypt**
- JWT tokens for authentication
- Role-based authorization
- HTTPS enforced in production
- CORS configured properly

## 📚 API Documentation

Access interactive API docs at: **http://localhost:8080/swagger-ui.html**

## 🚀 Deployment

### Azure
See `infrastructure/azure/README.md`

### AWS
See `infrastructure/aws/README.md`

## 📄 License

MIT License - see LICENSE file

---

**Built with ❤️ using Spring Boot and React**
