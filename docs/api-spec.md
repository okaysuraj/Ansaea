# Ansaea API Specification

The Ansaea backend is powered by FastAPI, offering an interactive Swagger UI at `/docs`. Below is a high-level summary of the core endpoints.

## Base URL
Local Development: `http://localhost:8000`

---

## 1. Authentication
Handles user identity and session tokens.

### `POST /api/auth/register`
Creates a new user account.
- **Payload**:
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword",
    "role": "user" // Options: "user" | "doctor"
  }
  ```
- **Returns**: `200 OK`
  ```json
  {
    "access_token": "eyJhbGci...",
    "token_type": "bearer",
    "user": { "username": "johndoe", "email": "john@example.com", "role": "user" }
  }
  ```

### `POST /api/auth/login`
Authenticates a user via OAuth2 Password Bearer flow.
- **Payload (Form Data)**:
  `username=john@example.com&password=securepassword` (Note: We pass email in the username field per OAuth2 spec).
- **Returns**: `200 OK` (Same format as `/register`).

---

## 2. Protected Endpoints (Requires `Authorization: Bearer <token>`)

### `GET /api/psychiatrists/`
Retrieves a list of available clinicians.
- **Returns**: Array of Psychiatrist objects.

### `POST /api/appointments/`
Books an appointment with a clinician.
- **Payload**:
  ```json
  {
    "psychiatrist_id": 1,
    "appointment_time": "2026-07-01T14:00:00Z",
    "notes": "Initial consultation."
  }
  ```

### `POST /api/tracker/mood`
Logs daily patient mood data.
- **Payload**:
  ```json
  {
    "score": 8,
    "notes": "Feeling energetic after sleep."
  }
  ```
