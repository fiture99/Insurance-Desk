# AfricMed Insurance Desk

A tool for hospital insurance staff to track and action member requests (add dependents, remove dependents, reinstate, update details) coming from insurance providers.

## Status

Currently a working front-end mockup/prototype, previewed on the canvas at `artifacts/mockup-sandbox/src/components/mockups/insurance-desk/InsuranceDesk.tsx`. All data lives in-memory in the browser (no backend or database yet) — refreshing the page resets it to the sample data. A standalone downloadable copy was exported for local use (see `exports/insurance-desk-standalone.zip`).

## Requirements

- **Per-user login** — username/password (not a shared PIN). Admin can create and delete staff accounts from a "Staff accounts" tab.
- **Policy number as primary identifier** — every member is identified by a `policyNo` (e.g. `POL-87397`), shown throughout the app in place of an internal ID.
- **Member records** track: policy number, name, insurer (the insurance company), employer (who employs the member), relationship on policy (Principal/Dependent/Spouse/Child), phone number, date of birth, status (Active/Inactive).
- **Insurer vs. employer are distinct fields** — the insurance company and the employing company are never the same field.
- **Staff can manage members** — any signed-in user can add, edit, and delete member records. Logged-out visitors get view-only access.
- **Request workflow** — requests move through stages: Received → Reviewed → Actioned → Confirmed. Types: Add dependent, Remove dependent, Update details, Reinstate. Actioning a request updates the linked member automatically (e.g. Remove → member goes Inactive, Reinstate → member goes Active, Add dependent → creates a new member record).
- **Policy number validation** — the request form autocompletes against existing members and warns if a policy number doesn't exist (for Remove/Reinstate) or already exists (for Add).
- **Multi-hospital isolation** — each hospital runs its own separate deployed instance of the app; there is no shared database between hospitals. Admin sets a facility/hospital name in a Settings tab, shown in the sidebar to identify which instance is running.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/mockup-sandbox run dev` — run the canvas mockup preview server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/mockup-sandbox/src/components/mockups/insurance-desk/InsuranceDesk.tsx` — the entire prototype UI (single component file: types, seed data, modals, tabs, main app)
- `exports/insurance-desk-standalone.zip` — a standalone Vite+React copy of the same component for running on a local machine outside Replit

## Architecture decisions

- The app is being built mockup-first on the canvas before graduating into a full artifact with a real backend/database — this keeps iteration on the UI/data model fast without needing schema migrations for every change.
- Policy number (`policyNo`) is the member-facing identifier everywhere in the UI, but each member also keeps an internal `id` for React keys/lookups.
- Member `insurer` and `employer` are kept as two separate fields since a hospital's insured population is grouped by employer, but each employer's members can be split across multiple different insurers.

## Product

- **Overview** — dashboard with open/confirmed request counts and active/deactivated member counts, plus a list of in-progress requests.
- **Requests** — list and detail view of every add/remove/update/reinstate instruction from insurers, with a stage tracker and the ability to log new requests and advance existing ones (staff only).
- **Members** — searchable table of all covered members with full add/edit/delete management (staff only); view-only when signed out.
- **Staff accounts** (admin only) — create and remove staff login accounts.
- **Settings** (admin only) — set the hospital/facility name shown in the sidebar.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After editing `InsuranceDesk.tsx`, the canvas iframe picks up changes via Vite HMR automatically — no need to manually mark it "live" unless the iframe state was left in "modifying".
- If exporting a fresh copy for local/offline use, re-zip `exports/insurance-desk-standalone.zip` after copying over the latest `InsuranceDesk.tsx`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
