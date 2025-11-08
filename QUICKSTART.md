# Quick Start Guide

Get the Employee Management System running in under 5 minutes!

## ⚡ Fastest Way (Docker Compose)

### Prerequisites
- Docker and Docker Compose installed
- Git

### Steps

1. **Clone and start**
   ```bash
   git clone <repository-url>
   cd payroll-processing
   docker-compose up --build
   ```

2. **Wait for services to start** (1-2 minutes)
   - PostgreSQL will initialize
   - Backend will run Flyway migrations
   - Frontend will build and start

3. **Create an admin user**

   Open a new terminal and run:
   ```bash
   docker exec -it ems-postgres psql -U postgres -d emsdb -c "
   INSERT INTO users (email, hashed_password, first_name, last_name, role, is_active, hire_date)
   VALUES (
     'admin@example.com',
     '\$2a\$10\$CwTycUXWue0Thq9StjUM0uJ8V7UXJlJvgP.KVpvt4rC7rF/3kLHJa',
     'Admin',
     'User',
     'ROLE_ADMIN',
     true,
     CURRENT_DATE
   );"
   ```

4. **Access the application**
   - Open browser: http://localhost
   - Login with:
     - Email: `admin@example.com`
     - Password: `admin123`

5. **Explore!**
   - Create employees
   - Add clients and projects
   - Create timesheets
   - Generate invoices

## 🛑 Stop Services

```bash
docker-compose down
```

To remove all data:
```bash
docker-compose down -v
```

## 📖 Next Steps

- Check out the [full README](README.md) for detailed documentation
- Explore the [API documentation](http://localhost:8080/swagger-ui.html)
- Review the [specification documents](copilot-instructions.md)

## 🐛 Troubleshooting

### Port conflicts
If ports 80, 8080, or 5432 are already in use:

Edit `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "3000:80"  # Change 80 to 3000 or another free port

backend:
  ports:
    - "8081:8080"  # Change 8080 to 8081 or another free port

postgres:
  ports:
    - "5433:5432"  # Change 5432 to 5433 or another free port
```

### Backend won't start
Check logs:
```bash
docker logs ems-backend
```

Common issues:
- Database not ready: Wait a few more seconds
- Port conflict: See above
- Memory issues: Ensure Docker has at least 4GB RAM allocated

### Frontend won't load
Check logs:
```bash
docker logs ems-frontend
```

Clear browser cache and hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

## 💡 Development Mode

For active development with hot reload:

**Backend** (Terminal 1):
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm install
npm run dev
```

Frontend dev server: http://localhost:3000
Backend API: http://localhost:8080

## 🎯 What's Included?

✅ Complete backend REST API with Spring Boot
✅ Modern React frontend with Tailwind CSS
✅ PostgreSQL database with sample schema
✅ JWT authentication
✅ Role-based access control
✅ Docker containerization
✅ Cloud deployment templates (Azure & AWS)

## 📞 Need Help?

- Read the [full documentation](README.md)
- Check [API docs](http://localhost:8080/swagger-ui.html)
- Review specification: [copilot-instructions.md](copilot-instructions.md)

Happy coding! 🚀

