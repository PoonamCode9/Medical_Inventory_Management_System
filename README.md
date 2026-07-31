# MediStock — Medical Inventory Management Platform

Root project folder containing the frontend and backend as separate subprojects.

```
medistock-project/
├── frontend/   # React + Vite app (fully built, mock data)
└── backend/    # Spring Boot backend — medicines/suppliers API + expiry email notifications
```

## Frontend

See `frontend/README.md`. Quick start:

```bash
cd frontend
npm install
npm run dev
```

The frontend currently runs on its own mock data and isn't yet wired to call the
backend API — see "Connecting the frontend" in `backend/README.md` for what's needed.

## Backend

Spring Boot (Java 17), Spring Data JPA, Spring Mail. Provides:

- REST CRUD for medicines and suppliers
- A daily scheduled job that scans expiry dates and emails a real SMTP alert
  (expired / critical / near-expiry) to configured recipients, with duplicate-send
  protection
- A manual trigger endpoint (`POST /api/notifications/check-expiry`) to fire an
  expiry check + email on demand

Quick start (see `backend/README.md` for full SMTP setup):

```bash
cd backend
mvn spring-boot:run
```

Note: this backend was generated in a sandboxed environment without access to
Maven Central, so `mvn spring-boot:run` / `mvn package` has **not** been run or
verified to compile here. Run it locally and fix any dependency-version hiccups
(e.g. Lombok isn't actually used — safe to remove from `pom.xml` — the rest of
the code doesn't depend on annotation processing).
