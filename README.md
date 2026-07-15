# Ansaea
**Precision Health for Human Longevity**

Ansaea is a sophisticated, "Medical-Luxury" mental health and longevity platform. It is designed to provide actionable clinical protocols driven by unique patient data, delivering a premium "Clinical Precision" user experience.

## Tech Stack
- **Frontend**: React 19, Vite, Vanilla CSS (Custom Design System), Recharts, Lucide React
- **Mobile**: React Native, Expo, NativeWind
- **Backend**: Python 3.11, FastAPI, SQLAlchemy (Async), Pydantic
- **Database**: Neon Cloud Postgres (PostgreSQL 18)
- **Authentication**: Firebase Auth (Email/Password & JWT Verification)

---

## Current Features
Ansaea features a comprehensive 5-Role architecture with complete End-to-End Database wiring.

- **Patient Portal**: Tracks daily vitals, mood (with AI analysis), CBT logs, self-care habits, and allows users to upload medical records. Connects patients with a directory of available psychiatrists.
- **Doctor Portal**: Enables doctors to manage appointments, write structured clinical notes (SOAP format), and issue E-Prescriptions securely.
- **Pharmacy Dashboard**: Live inventory tracking and real-time prescription order management.
- **Lab Dashboard**: Manages lab test requests, tracks sample collection, and uploads final reports.
- **Admin Dashboard & System Monitoring**: Super Admins can approve or reject doctor profiles, toggle global HIPAA & GDPR compliance modes, view real-time API uptime, and monitor all system actions via the active Audit Log.
- **AI Intelligence**: Integrated Google Gemini for AI-driven Symptom Triage, providing instant medical categorization.
- **Robust Security**: Fully authenticated backend routes strictly enforce role-based access controls using Firebase JWT tokens.

---

## Deployment & API Keys Guide

To make the project fully functional, you need to configure API Keys for the Database, Authentication, and AI layers.

### 1. Database Setup (Neon Postgres)
You need a PostgreSQL database. We recommend Neon Serverless Postgres.
- Go to [Neon.tech](https://neon.tech/) and create a project.
- Copy your Postgres Connection String.

### 2. Authentication Setup (Firebase)
- Go to the [Firebase Console](https://console.firebase.google.com/), create a project, and enable **Authentication (Email/Password)**.
- Generate your Firebase Web Config (API Key, Auth Domain, Project ID, etc.).
- Generate a **Service Account Key** (`ansaea-service-account.json`) from Project Settings > Service Accounts. Place this file in `backend/` for backend token verification.

### 3. AI Setup (Google Gemini)
- Go to [Google AI Studio](https://aistudio.google.com/) and generate an API key.

### 4. Environment Variables
Create `.env` files in both the `backend` and `frontend` folders.

**`backend/.env`**
```env
# Database
DATABASE_URL=postgresql+asyncpg://<USER>:<PASSWORD>@<NEON_HOST>/neondb?sslmode=require
# Secret for JWT encoding
SECRET_KEY=generate_a_random_secure_secret_string
# AI Service
GEMINI_API_KEY=your_gemini_api_key_here
# Firebase Admin SDK Credentials
GOOGLE_APPLICATION_CREDENTIALS=ansaea-service-account.json
```

**`frontend/.env` & `mobile/.env`**
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
# API URL (Update for production)
VITE_API_URL=http://localhost:8000/api
EXPO_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Commands to Run the Application

You must run the Backend, Web Frontend, and Mobile apps in separate terminal windows.

### 1. Run the Backend (FastAPI)
```bash
cd backend
python -m venv venv

# On Windows:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload
```
The API will be available at `http://localhost:8000` with Swagger documentation at `http://localhost:8000/docs`.

### 2. Run the Web Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
The web app will be available at `http://localhost:5173`.

### 3. Run the Mobile App (Expo)
```bash
cd mobile
npm install
npx expo start
```
Scan the generated QR code with the Expo Go app on your physical device, or press `a` to run on Android Emulator, or `i` to run on iOS Simulator.

## License
© 2026 Ansaea. All rights reserved.
