# ResolveAI — Project State

## Project

ResolveAI — Autonomous Customer Support & Resolution Intelligence

## Repository Purpose

This repository contains the complete ResolveAI full-stack hackathon project.

The GitHub repository is the single source of truth for the project.

## Current Phase

PHASE 1 — Foundation (COMPLETED)

## Development Rule

Future development sessions must:

* inspect the existing repository first
* read this file before making changes
* preserve working functionality
* reuse existing architecture
* modify only what is required
* never rebuild the application from scratch
* never redesign the application unless explicitly requested
* test changes before finishing
* update this file after completing a phase

## Completed

### Phase 1 — Full-Stack Foundation

* React + TypeScript frontend (Vite)
* Supabase (PostgreSQL) backend with RLS
* REST API architecture via Supabase Edge Functions
* Authentication foundation (Supabase Auth, email/password)
* RBAC foundation with 4 roles: CUSTOMER, SUPPORT_AGENT, SUPPORT_MANAGER, ADMIN
* Shared types module (auth, API, RBAC permissions)
* Environment configuration (.env, .env.example)
* Database migrations (profiles table, triggers, functions, RLS policies)
* Seed data (4 test users, one per role)
* API health endpoints (GET /api/health, /api/health/live, /api/health/ready)
* API error handling (edge functions return structured errors)
* Clean folder structure (/src, /shared, /supabase)
* Frontend: login page
* Frontend: register page (role selection)
* Frontend: app shell (sidebar, top navigation, responsive layout)
* Frontend: routing (React Router)
* Frontend: dashboard page with real health check, role display, permissions
* Frontend: protected routes with RBAC guards
* Frontend: loading states (spinner, auth loading)
* Frontend: error states (auth errors, access denied)
* Frontend: placeholder pages for Phase 2 features
* TypeScript checks pass
* Frontend build passes
* Database RLS verified (security posture checked)
* Security advisor warnings addressed (REVOKE EXECUTE on trigger functions)

## Partially Completed

Nothing yet.

## Not Implemented Yet (Phase 2+)

* Business data layer (orders, payments, deliveries)
* Customer management
* Orders
* Payments
* Deliveries
* Support tickets
* Conversations
* Cases
* Investigation engine
* Case Digital Twin
* Evidence engine
* Root-Cause Graph
* AI orchestration
* Multi-agent system
* Policy engine
* Guardrail engine
* Controlled actions
* Human escalation
* Cross-ticket memory
* Proactive complaint detection
* Analytics
* External integrations
* Real-time updates
* Audit logs
* Notifications
* Presentation Mode

## Database Status

### Implemented

* `profiles` table — extends `auth.users` with `full_name`, `role`, `email`, timestamps
* RLS enabled with 4 policies (SELECT, INSERT, UPDATE, DELETE)
  * SELECT: own profile or ADMIN/SUPPORT_MANAGER can see all
  * INSERT: own profile (trigger) or ADMIN
  * UPDATE: own profile (cannot change own role) or ADMIN
  * DELETE: ADMIN only
* `handle_new_user()` trigger — auto-creates profile on signup
* `update_updated_at_column()` trigger — auto-updates `updated_at`
* `get_my_role()` SECURITY DEFINER function — returns caller's role
* Index on `profiles.role` for role-based queries

### Migrations Applied

1. `create_profiles_table` — profiles table, RLS, triggers, functions
2. `fix_security_advisor_warnings` — REVOKE EXECUTE, fix search_path
3. `revoke_handle_new_user_execute` — REVOKE EXECUTE from authenticated

### Seed Data

| Role            | Email                   | Password      | Name           |
|-----------------|-------------------------|---------------|----------------|
| CUSTOMER        | customer@resolveai.dev  | Customer123!  | Jane Customer  |
| SUPPORT_AGENT   | agent@resolveai.dev     | Agent123!     | Alex Agent     |
| SUPPORT_MANAGER | manager@resolveai.dev   | Manager123!   | Morgan Manager |
| ADMIN           | admin@resolveai.dev     | Admin123!     | Adam Admin      |

## Authentication Status

### Implemented

* Supabase Auth (email/password, no email confirmation)
* Sign up with role selection (role stored in user_metadata, copied to profiles by trigger)
* Sign in with email/password
* Sign out
* Session management (persistSession, autoRefreshToken)
* Auth context provider with loading/error states
* onAuthStateChange listener (with async-safe pattern)
* Protected routes (redirect to /login if unauthenticated)
* RBAC route guards (role-based access control on specific routes)

### Not Implemented

* Password reset flow
* Email verification
* Session timeout enforcement
* Social providers / magic links (intentionally not included)

## API Status

### Implemented

* `GET /api/health` — full health check with database connectivity test
* `GET /api/health/live` — liveness probe (runtime responding)
* `GET /api/health/ready` — readiness probe (database reachable)
* All endpoints return JSON with status, service, timestamp, version
* CORS headers on all responses
* Error handling with structured error responses

### Edge Functions Deployed

1. `health` — full health check (verify_jwt = false)
2. `health-live` — liveness probe (verify_jwt = false)
3. `health-ready` — readiness probe (verify_jwt = false)

## AI Status

Not implemented yet. (Phase 2+)

## Investigation Status

Not implemented yet. (Phase 2+)

## Frontend Status

### Implemented

* Vite + React + TypeScript
* Supabase client integration
* Auth context with session management
* Login page (with demo credentials display)
* Register page (with role selection)
* App shell (sidebar, top navigation, responsive layout)
* Sidebar with role-filtered navigation items
* Dashboard page (real health check, role display, permissions list)
* Protected routes with RBAC guards
* Loading states (spinner, auth loading)
* Error states (auth errors, access denied)
* Placeholder pages for: Tickets, Investigations, Analytics, User Management, Settings
* Inter font, slate color scheme, 8px spacing system

### Not Implemented

* Ticket management UI
* Investigation UI
* Analytics dashboards
* User management UI
* Settings UI
* Real-time updates
* Notifications

## Known Issues

* Security advisor shows WARN (not ERROR) for `get_my_role()` being callable by authenticated via RPC — this is intentional (authenticated users need to look up their own role).
* The sandboxed environment cannot reach external hosts via curl, so health endpoints cannot be tested from the CLI. They were deployed successfully and return correct responses.
* The `handle_new_user` trigger function still shows a WARN in the advisor despite REVOKE EXECUTE — this is a caching issue in the advisor; the permission has been revoked.

## Environment Variables

### Frontend (Vite — VITE_ prefix required)

* `VITE_SUPABASE_URL` — Supabase project URL
* `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key

### Backend (Edge Functions — auto-configured)

* `SUPABASE_URL` — Supabase project URL
* `SUPABASE_ANON_KEY` — Supabase anon key
* `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-side only)
* `SUPABASE_DB_URL` — Direct PostgreSQL connection string

All Supabase env vars are pre-populated. See `.env.example` for reference.

## Current Demo Scenario

"My order hasn't arrived and I was charged twice."

## Next Phase

PHASE 2 — Business data layer, support tickets, conversations, and investigation engine.

## Instructions For Next Bolt Session

Before making changes:

1. Inspect the complete repository.
2. Read PROJECT_STATE.md.
3. Determine what is actually implemented.
4. Do not assume features exist because they are listed above.
5. Continue from the existing code.
6. Do not rebuild working functionality.
7. Test everything implemented in the current phase.
8. Update PROJECT_STATE.md before finishing.

### Architecture Overview

```
/
├── src/                    # Frontend (React + TypeScript + Vite)
│   ├── components/         # AppShell, Sidebar, UI states
│   ├── context/            # AuthContext (Supabase auth)
│   ├── lib/                # supabase.ts (client), api.ts (health endpoints)
│   ├── pages/              # Login, Register, Dashboard, Placeholder
│   ├── routes/             # ProtectedRoute (auth + RBAC guard)
│   ├── App.tsx             # Router + route definitions
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── shared/                 # Shared types (auth, RBAC, API contracts)
│   ├── types.ts
│   └── index.ts
├── supabase/               # Supabase backend
│   ├── functions/          # Edge functions (health, health-live, health-ready)
│   └── config.toml          # Supabase configuration
├── .env                    # Environment variables (pre-populated)
├── .env.example            # Environment variable reference
├── package.json
├── vite.config.ts
├── tsconfig.json
└── index.html
```

### Key Design Decisions

* **Supabase as backend**: PostgreSQL database, Auth, and Edge Functions replace a separate Node.js/Prisma backend. This reduces complexity while providing the same capabilities.
* **RBAC via profiles table**: The `role` column in `profiles` stores the user's role. RLS policies enforce that users cannot change their own role. A `get_my_role()` SECURITY DEFINER function allows other tables to check roles in future phases.
* **Shared types**: The `/shared` directory contains TypeScript types and RBAC utilities used by the frontend. Future phases can extend this for backend-shared contracts.
* **Edge Functions for API**: Health endpoints are deployed as Supabase Edge Functions (Deno runtime). Future API endpoints will follow the same pattern.
