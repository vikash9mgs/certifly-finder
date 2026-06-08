# CertVerify — React JSX + Express

The app is split into two independent folders:

```
frontend/   React 18 + Vite (JSX), React Router, axios
backend/    Node + Express + Supabase JS
```

The original `src/` (TanStack Start) is left in place so the Lovable preview
keeps working. Delete it locally if you only want the split version.

## Backend

```bash
cd backend
cp .env.example .env       # fill in SUPABASE_URL + keys
npm install
npm run dev                # http://localhost:4000
```

Endpoints:

- `POST /api/auth/login` — `{ email, password }` → `{ token, user }`
- `POST /api/auth/reset-password` — `{ email }`
- `GET  /api/certificates/verify/:certificateId` (public)
- `GET  /api/certificates` (admin)
- `POST /api/certificates` (admin)
- `PUT  /api/certificates/:id` (admin)
- `DELETE /api/certificates/:id` (admin)

Admin routes require `Authorization: Bearer <token>` and an `admin` role in
the `user_roles` table.

## Frontend

```bash
cd frontend
cp .env.example .env       # VITE_API_URL=http://localhost:4000/api
npm install
npm run dev                # http://localhost:5173
```

Vite dev server also proxies `/api` → `http://localhost:4000` so you can
leave `VITE_API_URL` unset in development.

## Database

Both apps share the same Supabase database (table `certificates`,
`user_roles`, function `has_role`). No schema changes needed.
