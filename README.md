# Ansaea

Ansaea has three applications. Run the API alongside the web or mobile client.

| Directory | Purpose | Entry point |
| --- | --- | --- |
| `backend/` | FastAPI API and PostgreSQL storage | `app/main.py` |
| `frontend/` | React web application | `src/main.jsx` |
| `mobile/` | Expo application for Android and iOS | `src/app/_layout.tsx` |

## Local setup

Use Python 3.11+, Node.js 22.13+ and PostgreSQL. Each application has its own dependencies and `.env` file.

Copy `backend/.env.example`, `frontend/.env.example`, and `mobile/.env.example` to `.env` in their respective directories. Use the same Firebase project for both clients and the API. Enable email/password authentication in Firebase.

### API

From `backend/`:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

On macOS/Linux, activate with `source venv/bin/activate`.

Create the database named in `DATABASE_URL` before starting. The API creates missing tables at startup; changes to existing columns still require an explicit database migration.

API: http://localhost:8000

Interactive endpoint documentation: http://localhost:8000/docs

### Web

From `frontend/`:

```sh
npm ci
npm run dev
```

Open http://localhost:5173. Run `npm run build` for production and `npm run preview` to inspect that build. `netlify.toml` contains the hosting configuration.

### Mobile

From `mobile/`:

```sh
npm ci
npm start
```

Use `npm run android` or `npm run ios` to open a simulator. Video calling uses native Daily/WebRTC modules and needs a development build containing those modules.

Set `EXPO_PUBLIC_API_URL` to your computer's LAN address on a physical device, for example `http://192.168.1.20:8000/api`. Run the API with `--host 0.0.0.0` to make it reachable. The default URL uses `10.0.2.2` on Android emulators and `localhost` elsewhere. Restart Expo after changing environment values.

## Configuration

- **PostgreSQL:** `DATABASE_URL` uses the `postgresql+asyncpg://` scheme.
- **Firebase clients:** web uses `VITE_FIREBASE_*`; mobile uses `EXPO_PUBLIC_FIREBASE_*`. These values are included in the client bundle.
- **Firebase API:** supply service account fields from `backend/.env.example`, or use Firebase application default credentials. Keep private keys on the backend.
- **AI:** `GEMINI_API_KEY` enables Gemini. The existing service provides fallback responses when a key is absent or a request fails.
- **Uploads:** `CLOUDINARY_URL` configures Cloudinary.
- **Video:** `DAILY_API_KEY` enables Daily room creation. Without it, the API uses `VIDEO_FALLBACK_URL` or a generated Jitsi URL. A fallback URL needs a client that supports its provider.
- **Origins:** configure allowed web domains in `backend/app/main.py` when deploying to a different host.

Registration saves the requested patient/doctor role before email verification. Other protected endpoints require a verified email. Admin, lab, and pharmacy roles must be assigned through administration.

## Where changes belong

- `backend/app/routes/`: HTTP endpoints grouped by domain. Each module documents its purpose.
- `backend/app/models/db_models.py`: database tables and relationships.
- `backend/app/models/schemas.py`: shared request validation and response schemas.
- `backend/app/services/`: AI, video provider, and file storage integrations.
- `backend/app/auth.py`: Firebase token checks and local account lookup.
- `frontend/src/App.jsx`: web routes and role protection.
- `frontend/src/pages/`: route screens grouped by role.
- `frontend/src/components/`: UI reused by screens. `PortalLayout.jsx` owns the shared sidebar and sign-out flow.
- `frontend/src/hooks/useApiData.js`: resource loading, cancellation, refresh, and request errors.
- `frontend/src/styles/`: tokens, base elements, layouts, and feature styles. `index.css` preserves their import order.
- `mobile/src/app/`: Expo file-based routes. Small re-export files retain existing navigation paths.
- Both clients use `src/context/AuthContext` for session state, `src/context/useAuth` to consume it, and `src/utils/api` for URL construction and requests.

Keep form state near its screen. Extract shared code when multiple features use it. Comment decisions, data formats, and integration constraints; avoid comments that restate the code.

## Checks

From `frontend/`:

```sh
npm run lint
npm run build
```

From `mobile/`:

```sh
npm run typecheck
npx expo export --platform android
```

Use a device or emulator to verify login, role navigation, booking, and calls with configured services. Generated bundles, caches, dependencies, local credentials, and logs are excluded by the root `.gitignore`.
