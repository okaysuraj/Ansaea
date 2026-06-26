# Ansaea Architecture Overview

Ansaea is built on a decoupled Client-Server architecture utilizing a React Single Page Application (SPA) communicating via RESTful JSON APIs to a FastAPI backend.

## 1. System Components

### 1.1 Client (Frontend)
- **Technology**: React 19, Vite
- **Responsibility**: Rendering the UI, managing client-side state, handling form submissions, and securing routes based on JWT authentication.
- **Key Modules**:
  - `AuthContext`: Manages JWT tokens (`ansaea_token`) and user identity/roles (`ansaea_user`) in `localStorage`.
  - `AppContent`: The primary routing dispatcher. Inspects `user.role` to render either `DoctorDashboard` or `UserDashboard`.

### 1.2 API Server (Backend)
- **Technology**: Python 3.11, FastAPI
- **Responsibility**: Business logic, data validation (via Pydantic), authentication (JWT/bcrypt), and database interactions.
- **Key Modules**:
  - `main.py`: Entry point, CORS configuration, and Auth routing (`/api/auth/register`, `/api/auth/login`).
  - `routers/`: Separated logical route domains (`tracker.py`, `psychiatrist.py`, `chat.py`).
  - `database.py`: SQLAlchemy asynchronous engine configuration.

### 1.3 Database
- **Technology**: Neon Cloud Postgres (PostgreSQL 18)
- **Responsibility**: Persistent data storage.
- **ORM**: SQLAlchemy (`asyncpg` driver).
- **Schema Highlights**:
  - `User`: Primary identity table containing `email`, `hashed_password`, and `role` ("user" or "doctor").
  - `Psychiatrist`: Directory of available clinicians with availability slots and pricing.
  - `Appointment`, `MoodLog`, `CBTLog`: User-generated clinical data linked to `User.id`.

## 2. Authentication & Role Flow

Ansaea utilizes stateless JWT (JSON Web Token) authentication.

1. **Registration**: The user selects a role ("Patient" or "Clinician") on the frontend. The payload `{username, email, password, role}` is sent to `POST /api/auth/register`. The backend securely hashes the password and saves the `role`.
2. **Login**: The user provides `{email, password}`. The backend verifies credentials and returns a JWT along with the user's `role`.
3. **Session**: The frontend stores the JWT. Subsequent API calls include the `Authorization: Bearer <token>` header. The frontend dynamically renders the correct dashboard based on the stored `role`.
