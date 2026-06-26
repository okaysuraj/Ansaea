# Ansaea Backend

This is the FastAPI backend application for Ansaea.

## Setup & Running Locally

Follow these steps to run the backend on your host machine without containers.

### Prerequisites
- Python 3.11 or higher
- Pip (Python Package Installer)

### 1. Virtual Environment Setup
It is highly recommended to use a Python virtual environment to isolate the project dependencies.

```bash
# Navigate to the backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# Windows (Command Prompt):
.\venv\Scripts\activate.bat

# macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies
Install all the backend packages using `pip`:

```bash
pip install -r requirements.txt
```

### 3. Environment Variable Configuration
The backend loads configuration settings from `.env` inside the current working directory. You can use the root `.env` or create a `.env` in this directory:

1. Copy the example environment template:
   ```bash
   cp .env.example .env
   ```
2. Configure `DATABASE_URL` with your Neon Cloud Postgres database connection string (specifying `postgresql+asyncpg` as the protocol and appending `?sslmode=require` at the end).
3. Set your `SECRET_KEY` and any optional API keys (like `GEMINI_API_KEY` for AI features).

### 4. Run the Backend API Server
Start the development server using `uvicorn`:

```bash
uvicorn app.main:app --reload
```

The API server will run on [http://localhost:8000](http://localhost:8000).
Interactive Swagger documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).
