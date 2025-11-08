
# Project and Code Guidelines for FastAPI Application

- Always use type hints for function parameters and return values.
- Follow RESTful API design principles for endpoint naming and resource organization.
- Implement proper dependency injection for services and database sessions.
- Use Pydantic models for request and response body validation and serialization.
- Include comprehensive error handling with appropriate HTTP exceptions.
- Ensure all endpoints are documented using FastAPI's automatic OpenAPI generation capabilities.
- Prioritize clear and readable code, with comments only where complexity warrants it.
- Adhere to the Black code formatter for consistent code style.

Specific FastAPI-related Instructions: 
# FastAPI Specific Instructions

- When creating new endpoints, ensure they are registered with an `APIRouter` for modularity.
- For database interactions, use `SQLAlchemy` and `asyncpg` (if using PostgreSQL) for asynchronous operations.
- Implement authentication and authorization using `FastAPI.security` components like `OAuth2PasswordBearer`.
- For background tasks, consider using `Celery` or `FastAPI`'s built-in `BackgroundTasks`.
- When defining Pydantic models, use `Field` for validation constraints and `Extra.forbid` to prevent unexpected fields.
- For testing, use `pytest` with `httpx.AsyncClient` for making requests to the test application.

File-specific Instructions (using applyTo): 
---
applyTo: "**/*.py"
---
# Python File Instructions

- Ensure all Python files adhere to PEP 8 conventions.
- Avoid using global variables where possible; prefer dependency injection or configuration objects.
- Structure imports logically (standard library, third-party, local modules).

These examples demonstrate how to provide both general and specific instructions to guide Copilot in generating code that aligns with your project's requirements and best practices for FastAPI development. 

AI responses may include mistakes.

