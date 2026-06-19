# Ansaea
**Precision Health for Human Longevity**

Ansaea is a sophisticated, "Medical-Luxury" mental health and longevity platform. It is designed to provide actionable clinical protocols driven by unique patient data, delivering a premium "Clinical Precision" user experience.

[Ansaea Architecture](docs/architecture.md)

## Tech Stack
- **Frontend**: React 19, Vite, Vanilla CSS (Custom Design System), Recharts, Lucide React
- **Backend**: Python 3.11, FastAPI, SQLAlchemy (Async), Pydantic
- **Database**: PostgreSQL 18
- **Infrastructure**: Docker & Docker Compose

## Quick Start

### 1. Prerequisites
Ensure you have the following installed on your system:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### 2. Environment Setup
Create a `.env` file in the root directory with the following variables:
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ansaea_db
DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/ansaea_db
SECRET_KEY=your_super_secret_key_here
```

### 3. Run the Application
Start the entire stack (Database, Backend API, and Frontend Vite Server) using Docker Compose:

```bash
docker compose up -d
```

### 4. Access the App
- **Frontend App**: [http://localhost:80](http://localhost:80)
- **Backend API Docs (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)

## Documentation
Detailed architectural and technical documentation can be found in the `docs/` directory:
- [Architecture & Data Models](docs/architecture.md)
- [API Specification](docs/api-spec.md)
- [Design System & UI Tokens](docs/design-system.md)

## License
© 2026 Ansaea. All rights reserved.
