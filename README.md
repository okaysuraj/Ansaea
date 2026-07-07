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

## Project Audit & Implementation Status

### 1. User Roles & Access Control
> [!NOTE]
> **Status:** ✅ Core features implemented.
- **Implemented:** The database (`User` model) supports `patient`, `doctor`, `admin`, `lab`, `pharmacy`, and `super_admin` roles. Both Web and Mobile apps have role-based routing and dedicated dashboards (e.g., `AdminDashboard.jsx`, `(admin)` mobile layout). Organization-level accounts (`Organization` model) are also fully implemented.
- **Missing:** Temporary caregiver access (family members) and granular role-based permissions (view/edit/export) within a specific role.

### 2. Patient App Features
> [!NOTE]
> **Status:** ⚠️ Partially implemented (Strong on mental health & basics, lacking in deep integrations).
- **Implemented:** 
  - **Mental Health:** Extensive tracking is present (`MoodSelector.jsx`, `CBTDiary.jsx`, `BreathingExercise.jsx`, `SelfCareTracker.jsx`), backed by `MoodLog`, `CBTLog`, and `HabitLog` DB models.
  - **Physical Health:** Basic vitals tracking is implemented (`VitalsTracker.jsx` and `VitalSign` model).
  - **Medical Records:** Document upload structure exists (`MedicalRecords.jsx`, `MedicalRecord` model).
  - **Doctor Discovery:** Directory search is available (`PsychiatristDirectory.jsx`).
  - **AI Symptoms:** AI Triage is built into the backend (`ai_service.py`) and mobile app (`symptoms.tsx`).
- **Missing:**
  - ABHA / National Health ID support (India-ready).
  - Wearable device sync/API integrations (Apple Health, Fitbit).
  - Insurance details, Co-pay calculations, GST Invoices.
  - Wallet, payments, and refunds.
  - OCR + Smart extraction for uploaded medical records.

### 3. Doctor App Features
> [!NOTE]
> **Status:** ✅ Core features implemented.
- **Implemented:** Doctor Profiles (`DoctorProfile` model) with specialty and fee config. Appointment Management is handled via `AppointmentScheduler.jsx` and `DoctorDashboard.jsx`. Clinical tools such as `ClinicalNotes.jsx` and `EPrescription.jsx` are fully functional and backed by DB models.
- **Missing:** AI-assisted documentation/note generation (although an AI service exists, it is not wired up for doctors yet), earnings/payout tracking, and advanced slot management with auto-buffer times.

### 4. Pharmacy & Lab Modules
> [!NOTE]
> **Status:** ✅ Basic implementation present.
- **Implemented:** Both have dedicated dashboards (`PharmacyDashboard.jsx`, `LabDashboard.jsx`) and backend models (`PharmacyOrder`, `LabTestRequest`). They can manage pending requests, update statuses, and fulfill orders.
- **Missing:** Inventory management, substitute suggestions, detailed delivery tracking for pharmacy, and TAT tracking for labs.

### 5. Consultations & Telemedicine
> [!WARNING]
> **Status:** ❌ Requires third-party integrations.
- **Implemented:** UI shells exist for Chat (`ChatSession.jsx`) and Call (`CallSession.jsx`). The `Message` DB model supports text-based chats.
- **Missing:** Real-time WebRTC, video, and audio calling are mock implementations. You need a provider like **Twilio** or **Agora** to make video/audio calls functional in production.

### 6. AI & Intelligence Layer
> [!NOTE]
> **Status:** ⚠️ Partially implemented.
- **Implemented:** The backend has `ai_service.py` configured to use Google Gemini for smart triage and symptom checking.
- **Missing:** Health risk scoring, medication adherence predictions, and chronic disease progression modeling are not yet built out.

### 7. Security, Privacy & Admin Dashboard
> [!WARNING]
> **Status:** ⚠️ Action Required before Production.
- **Implemented:** End-to-end routing with Firebase Authentication. Basic admin dashboard (`AdminDashboard.jsx`) for approvals.
- **Missing:** Audit logs, data anonymization scripts, HIPAA/GDPR compliance tools, and end-to-end encryption for chat messages (currently stored as plain text in the DB).

---

## What You Need to Do for Production Deployment

To make this project fully production-ready, you need to configure the following environment variables, keys, and additional services:

### 1. Missing Third-Party Integrations
* **Payments:** Integrate **Stripe** or **Razorpay** for consultation fees and pharmacy orders.
* **Telemedicine Video/Audio:** Integrate **Agora** or **Twilio Video** for `CallSession.jsx`.
* **Push Notifications:** Configure **Expo Push Notifications** or **Firebase Cloud Messaging (FCM)** for appointment and medication reminders.
* **Email Service:** Integrate **SendGrid**, **AWS SES**, or **Postmark** for transactional emails (invoices, welcome emails).

### 2. Environment Variables (`.env`) Configuration
You must replace the placeholder keys in your `.env` files with actual production keys.

**Backend (`backend/.env`)**
* `DATABASE_URL`: Ensure your Neon DB or production Postgres URL is secure.
* `SECRET_KEY`: Generate a strong, random 256-bit key for JWT/Sessions.
* `GEMINI_API_KEY`: Set your Google Gemini API key for the AI Symptom Checker.
* `GOOGLE_APPLICATION_CREDENTIALS`: Ensure the `ansaea-service-account.json` file has the correct IAM permissions for production Firebase Admin SDK.

**Frontend (`frontend/.env`)**
* The current keys (e.g., `VITE_FIREBASE_API_KEY`) are visible in your code. Ensure your Firebase project has proper **App Check** and restricted API Key referrers setup in Google Cloud Console so no one else can abuse your Firebase quota.
* `VITE_API_URL`: Change `http://localhost:8000/api` to your deployed backend URL (e.g., `https://api.ansaea.com/api`).

### 3. Deployment Infrastructure
* **Backend:** Deploy the FastAPI app using **Docker** to platforms like AWS ECS, Google Cloud Run, or Render. Use `gunicorn` with `uvicorn` workers.
* **Frontend:** Deploy the Vite React app to **Vercel**, **Netlify**, or **AWS S3 + CloudFront**.
* **Mobile:** Build the Expo app using **EAS Build** (Expo Application Services) to generate `.apk`/`.aab` (Android) and `.ipa` (iOS) files for app store submission.

> [!TIP]
> Prioritize setting up your real-time video infrastructure (Agora/Twilio) and Payment Gateway (Stripe/Razorpay), as those are the biggest blockers for a fully functioning telemedicine app.

## License
© 2026 Ansaea. All rights reserved.
