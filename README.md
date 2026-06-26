# Ansaea
**Precision Health for Human Longevity**

Ansaea is a sophisticated, "Medical-Luxury" mental health and longevity platform. It is designed to provide actionable clinical protocols driven by unique patient data, delivering a premium "Clinical Precision" user experience.

[Ansaea Architecture](docs/architecture.md)

## Tech Stack
- **Frontend**: React 19, Vite, Vanilla CSS (Custom Design System), Recharts, Lucide React
- **Backend**: Python 3.11, FastAPI, SQLAlchemy (Async), Pydantic
- **Database**: Neon Cloud Postgres (PostgreSQL 18)
- **Infrastructure**: Cloud-hosted database, local direct execution (no containers)

## Quick Start

### 1. Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (v3.11 or higher)
- A [Neon Postgres](https://neon.tech/) account/database.

### 2. Environment Setup
1. Create a `.env` file in the root directory by copying the template:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your Neon connection string (`DATABASE_URL`). Be sure to use the `postgresql+asyncpg://` scheme with `sslmode=require` for secure async access:
   ```env
   DATABASE_URL=postgresql+asyncpg://<USER>:<PASSWORD>@<NEON_HOST>/neondb?sslmode=require
   SECRET_KEY=your_generated_secure_secret_key
   ```

### 3. Run the Backend API
Navigate to the `backend/` directory, set up your Python virtual environment, install requirements, and run the server:
```bash
cd backend
python -m venv venv
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```
For more backend details, see the [Backend README](file:///c:/Users/Suraj/Code/Ansaea/backend/README.md).

### 4. Run the Frontend App
Navigate to the `frontend/` directory, set up your environment variables, install Node dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
For more frontend details, see the [Frontend README](file:///c:/Users/Suraj/Code/Ansaea/frontend/README.md).

### 5. Access the App
- **Frontend App**: [http://localhost:5173](http://localhost:5173) (or the port Vite prints)
- **Backend API Docs (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)

## Documentation
Detailed architectural and technical documentation can be found in the `docs/` directory:
- [Architecture & Data Models](docs/architecture.md)
- [API Specification](docs/api-spec.md)
- [Design System & UI Tokens](docs/design-system.md)

## License
© 2026 Ansaea. All rights reserved.
