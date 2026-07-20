### 3. AI Setup (Google Gemini)
- Go to [Google AI Studio](https://aistudio.google.com/) and generate an API key.

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