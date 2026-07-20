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

### 4. Run the Backend API Server
Start the development server using `uvicorn`:

```bash
uvicorn app.main:app --reload
```

The API server will run on [http://localhost:8000](http://localhost:8000).
Interactive Swagger documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).
