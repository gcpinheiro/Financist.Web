# Financist Frontend

Financist is a production-oriented Angular 20 frontend for a finance operations dashboard. This implementation keeps the existing Angular workspace and reorganizes it into a scalable feature-based structure with a premium dark UI, reusable standalone components, Signals-driven local state, and backend-ready service boundaries.

## Stack

- Angular 20
- TypeScript
- SCSS
- Angular Signals
- Standalone Components
- Angular Router
- HttpClient
- SSR-capable Angular build
- `apexcharts`
- `ng-apexcharts`

## Main Decisions

- The app is split into `core`, `shared`, `layout`, and `features` to keep cross-cutting concerns separate from reusable UI and route-level business areas.
- Protected routes are wrapped by a single application shell with sidebar and topbar, while authentication lives outside that shell.
- Feature services use Signals for frontend state and expose backend-ready patterns through `ApiService`.
- Development mode uses mock data via `environment.development.ts`, while production mode is structured to talk to the real API.
- Reusable UI primitives such as cards, buttons, form fields, tables, loading states, and empty states keep feature pages consistent.
- Dashboard charts are implemented with ApexCharts and styled for the dark theme.

## Folder Structure

```text
src/
  app/
    core/
      api/
      auth/
      guards/
      interceptors/
    shared/
      components/
      data/
      models/
      ui/
    layout/
      app-shell/
      sidebar/
      topbar/
    features/
      auth/
      dashboard/
      transactions/
      categories/
      cards/
      goals/
      documents/
      settings/
  environments/
  styles/
```

## Feature Coverage

- Auth
  - Login page
  - Token persistence
  - Auth guard
  - JWT interceptor
  - Logout flow
- Dashboard
  - KPI cards
  - Expense donut chart
  - Income vs expenses line chart
  - Balance trend area chart
  - Recent transactions table
- AI Assistant
  - Chat page
  - Signal-based conversation state
  - Modular chat components
  - Backend-ready request/response service
- Transactions
  - Listing page
  - Creation form UI
- Categories
  - Listing page
  - Creation form UI
- Cards
  - Listing page
  - Creation form UI
- Goals
  - Listing page
  - Creation form UI
- Documents
  - Upload UI
  - Import history table
- Settings
  - Placeholder settings layout

## Installed Dependencies

Core project dependencies already present:

- `@angular/*`
- `rxjs`
- `express`

Added for this implementation:

- `apexcharts`
- `ng-apexcharts`

## Environment Configuration

Environment files live in `src/environments`.

- `environment.ts`
  - production-oriented defaults
  - `apiUrl: 'http://localhost:5000/api/v1'`
  - `useMockData: false`
- `environment.development.ts`
  - local development defaults
  - `apiUrl: 'http://localhost:5000/api/v1'`
  - `useMockData: true`

`angular.json` is configured to replace `environment.ts` with `environment.development.ts` when running the development build.

## How To Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start the Angular dev server:

```bash
npm start
```

3. Open:

```text
http://localhost:4200
```

4. The development environment uses mock data by default, so the app is usable immediately without the backend running.

## Build

```bash
npm run build
```

The project was validated with a successful production build.

## Backend Integration

The frontend is prepared for a .NET backend using:

- Base API URL: `http://localhost:5000/api/v1`
- Centralized API wrapper: `src/app/core/api/api.service.ts`
- Auth token storage: `src/app/core/auth/token-storage.service.ts`
- Auth service: `src/app/core/auth/auth.service.ts`
- JWT header injection: `src/app/core/interceptors/auth.interceptor.ts`
- Error interception and unauthorized redirect handling: `src/app/core/interceptors/api-error.interceptor.ts`

To connect to the real backend during local development:

1. Open `src/environments/environment.development.ts`
2. Set `useMockData` to `false`
3. Confirm the backend is running on `http://localhost:5000`
4. Adjust endpoint implementations in feature services as backend contracts evolve

## Authentication Notes

- The current development experience uses a mock login response when `useMockData` is enabled.
- Session data is stored in `localStorage`.
- Protected routes redirect unauthenticated users to `/auth/login`.
- The structure is ready for a real JWT-based backend login endpoint.

## UI System

Reusable shared components include:

- `app-shell`
- `sidebar`
- `topbar`
- `stat-card`
- `chart-card`
- `table-card`
- `page-header`
- `primary-button`
- `secondary-button`
- `form-field`
- `data-table`
- `loading-state`
- `empty-state`
- `section-card`

Global visual tokens are defined in:

- `src/styles/_tokens.scss`
- `src/styles/_base.scss`

## Notes For Future Expansion

- Feature services are a good place to replace mock sources with real API calls as backend endpoints are finalized.
- A dedicated notification/toast system can be added later without changing feature page structure.
- If backend complexity grows significantly, this structure can still absorb a stronger state strategy without refactoring the layout and shared UI layers.
