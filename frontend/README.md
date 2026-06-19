# Ansaea Frontend

This directory contains the React single-page application for Ansaea.

## Architecture

- **Framework**: React 19 + Vite
- **Routing**: Internal state-based routing via `AuthContext` and `AppContent` (No external router like `react-router-dom` is used to maintain simplicity).
- **Styling**: Pure Vanilla CSS (`index.css` and `landing.css`) implementing the Ansaea "Medical Luxury" design system. No Tailwind CSS or other utility libraries are required.
- **State Management**: React Context (`AuthContext.jsx`) is used for global auth and role state.

## Folder Structure

- `/public`: Static assets including `favicon.png`.
- `/src/components`: All React UI components.
  - `LandingPage.jsx`: The public-facing marketing page.
  - `SignupPage.jsx`: Registration flow with Patient/Clinician toggle.
  - `UserDashboard.jsx` (Inside `App.jsx`): The secure patient portal.
  - `DoctorDashboard.jsx`: The secure clinician portal.
- `/src/context`: React Context providers (`AuthContext.jsx`).
- `index.css`: Global design tokens and dashboard styling.
- `landing.css`: Specific styling for marketing and auth screens.

## Development

The frontend is served via Vite. In the Docker Compose environment, it runs with `--host 0.0.0.0` and `--usePolling` enabled to support hot-reloading on Windows/WSL filesystems.
