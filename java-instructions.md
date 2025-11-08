# Java Instruction Summary (Spring Boot)

## Context
- **Language:** Java 21+  
- **Framework:** Spring Boot  
- **Database:** PostgreSQL  
- **Build Tool:** Maven or Gradle  
- **Architecture:** Simple layered monolith (extendable to modular or microservice architecture)  
- **Goal:** Keep it **simple, secure, clean, and extendable**  

---

## Project Structure
```
src/main/java/com/acme/app/
  api/          (controllers, request/response DTOs)
  service/      (application logic)
  repository/   (Spring Data JPA interfaces)
  domain/       (entities, value objects)
  config/       (application configuration)
  security/     (authentication and authorization)
src/main/resources/
  application.yml
  db/migration/ (Flyway scripts)
```

---

## Core Guidelines
- Use **constructor-based dependency injection** (no field injection).  
- Use **records** for DTOs and simple data carriers.  
- Entities should remain minimal with JPA annotations.  
- Apply **validation** using `jakarta.validation` annotations.  
- Keep controllers thin: map requests → delegate to services → return responses.  
- Use **SLF4J** for logging.  
- Write clean, small, final classes and short methods.  
- Follow **SOLID** and **DRY** principles.  

---

## API Design
- RESTful endpoints under `/api/v1`.  
- Use **nouns and plural resource names** (e.g., `/employees`, `/timesheets`).  
- Follow HTTP semantics (`GET`, `POST`, `PUT`, `DELETE`).  
- Return correct HTTP codes (`201` for created, `400` for validation errors, etc.).  
- Standardize errors with **RFC 7807 ProblemDetail** responses.  
- Document all endpoints using **springdoc-openapi**.  

---

## Persistence
- Use **Spring Data JPA** with PostgreSQL.  
- Manage schema versions using **Flyway** migrations.  
- Keep repository interfaces expressive and concise.  
- Handle transactions in the **service layer** (`@Transactional` at method level).  
- Support pagination and sorting for all list endpoints.  

---

## Security
- Implement **JWT-based authentication** using Spring Security.  
- All endpoints require authentication except `/api/v1/auth/**`.  
- Use **BCrypt** for password hashing.  
- Apply **role-based access control (RBAC)** with roles like:
  - `ROLE_EMPLOYEE`
  - `ROLE_MANAGER`
  - `ROLE_ADMIN`
- Enforce authorization at method level using `@PreAuthorize`.  
- Stateless sessions with `SessionCreationPolicy.STATELESS`.  
- Disable CSRF for APIs; enable HTTPS in production.  
- Externalize secrets and keys using environment variables.  

---

### Example Security Configuration
```java
@Configuration
@EnableMethodSecurity
class SecurityConfig {

  @Bean
  SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
      .csrf(csrf -> csrf.disable())
      .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/v1/auth/**", "/actuator/**").permitAll()
        .anyRequest().authenticated())
      .oauth2ResourceServer(oauth -> oauth.jwt())
      .build();
  }
}
```

---

## Error Handling
- Centralize with a single `@ControllerAdvice` for exception mapping.  
- Map `MethodArgumentNotValidException` to structured validation errors.  
- Never expose stack traces or internal messages in responses.  

### Example
```java
@RestControllerAdvice
class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  ProblemDetail handleValidationErrors(MethodArgumentNotValidException ex) {
    var pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
    pd.setTitle("Validation Error");
    pd.setProperty("errors", ex.getFieldErrors().stream()
      .map(f -> Map.of("field", f.getField(), "message", f.getDefaultMessage()))
      .toList());
    return pd;
  }
}
```

---

## Testing
- Use **JUnit 5** for unit and integration tests.  
- Slice tests:
  - `@WebMvcTest` for controllers.  
  - `@DataJpaTest` for repositories.  
- Full tests with `@SpringBootTest`.  
- Add **Testcontainers (PostgreSQL)** profile for CI/CD later.  

---

## Observability
- Enable **Spring Boot Actuator** endpoints:
  - `/actuator/health`
  - `/actuator/info`
- Basic logging configuration for now (JSON logging in production later).  
- Add correlation IDs for request tracing.  
- Later, integrate **Micrometer + Prometheus/OpenTelemetry**.  

---

## Deployment
- Containerize using **Dockerfile + docker-compose** (App + Postgres).  
- Use **environment variables** for secrets and credentials.  
- Profiles: `dev`, `test`, `prod`.  
- Ready for future IaC (Terraform, AWS CDK, or Azure Bicep).  

---

## Patterns to Follow
- Layered architecture (api → service → repository).  
- DTOs for request/response; never expose entities directly.  
- Builder pattern for complex object creation.  
- Domain events placeholder for async flows (extend later).  
- Define service interfaces for clean abstraction.  

---

## Patterns to Avoid
- Fat controllers or God services.  
- Returning `Map<String, Object>` responses.  
- Business logic in controllers.  
- Static/global mutable state.  
- Overusing `@Transactional` on all methods.  
- Hardcoding credentials or environment values.  

---

## Example Controller
```java
@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
class EmployeeController {
  private final EmployeeService service;

  @GetMapping
  Page<EmployeeResponse> list(@RequestParam(defaultValue = "0") int page,
                              @RequestParam(defaultValue = "10") int size) {
    return service.getEmployees(page, size);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  EmployeeResponse create(@Valid @RequestBody EmployeeRequest request) {
    return service.createEmployee(request);
  }
}
```

---

## Example DTO
```java
public record EmployeeRequest(
  @NotBlank String firstName,
  @NotBlank String lastName,
  @Email String email,
  @NotNull LocalDate hireDate
) {}
```

---

## Future Extension Hooks
- Add **asynchronous events** using Spring Events, Kafka, or RabbitMQ.  
- Introduce **caching** with Spring Cache and Redis.  
- Add **distributed tracing and metrics**.  
- Refactor into **modular or microservice architecture** when scale requires.  
- Incorporate **CQRS or DDD patterns** for complex domains.  

---

## Summary
This document defines a **simple, secure, maintainable, and extendable** Spring Boot setup:
- Fully secured JWT-based REST API.  
- Clean layered structure with validation, error handling, and observability.  
- Future-ready for microservices, caching, and tracing.  
- Designed to stay **minimal today** and **scalable tomorrow**.
