# RESOLVEAI

Autonomous Customer Support & Resolution Intelligence

## Overview

ResolveAI is an enterprise AI SaaS platform for autonomous customer support and resolution intelligence. It investigates complaints, builds evidence-based cases, and resolves issues with guardrail-controlled actions.

## Current Status

**Phase 1 — Foundation** is complete. This includes:

- React + TypeScript frontend (Vite)
- Supabase (PostgreSQL) backend with Row Level Security
- Authentication with 4 RBAC roles: Customer, Support Agent, Support Manager, Admin
- Health check API endpoints
- Enterprise UI shell with sidebar, top navigation, and responsive layout
- Shared types for auth, RBAC permissions, and API contracts

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

The dev server runs automatically. To build manually:

```bash
npm run build
npm run typecheck
```

### Demo Credentials

| Role            | Email                   | Password      |
|-----------------|-------------------------|---------------|
| Customer        | customer@resolveai.dev  | Customer123!  |
| Support Agent   | agent@resolveai.dev     | Agent123!     |
| Support Manager | manager@resolveai.dev   | Manager123!   |
| Admin           | admin@resolveai.dev     | Admin123!     |

## Architecture

```
/
├── src/              # Frontend (React + TypeScript + Vite)
│   ├── components/   # AppShell, Sidebar, UI states
│   ├── context/      # AuthContext (Supabase auth)
│   ├── lib/          # Supabase client, API helpers
│   ├── pages/        # Login, Register, Dashboard, Placeholders
│   ├── routes/       # ProtectedRoute (auth + RBAC guard)
│   └── App.tsx       # Router + route definitions
├── shared/           # Shared types (auth, RBAC, API contracts)
├── supabase/         # Supabase backend
│   ├── functions/    # Edge functions (health endpoints)
│   └── config.toml   # Supabase configuration
└── .env.example      # Environment variable reference
```

## API Endpoints

| Endpoint              | Description                        |
|-----------------------|------------------------------------|
| GET /api/health       | Full health check with DB test     |
| GET /api/health/live  | Liveness probe                     |
| GET /api/health/ready | Readiness probe with DB check       |

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, React Router, Lucide Icons
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions / Deno)
- **Auth**: Supabase Auth (email/password, RBAC via profiles table)
- **Styling**: Inter font, slate color scheme, responsive design

## Roadmap

- **Phase 2**: Business data layer, support tickets, conversations, investigation engine
- **Phase 3**: AI orchestration, multi-agent system, Case Digital Twin, root-cause graph
- **Phase 4**: Policy engine, guardrails, controlled actions, human escalation
- **Phase 5**: Analytics, external integrations, real-time updates, presentation mode

## License

Proprietary — Hackathon project.
