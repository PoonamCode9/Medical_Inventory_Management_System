# MediStock Backend

Spring Boot API for MediStock: medicine/supplier CRUD, expiry tracking, and a
**working, real-SMTP email notification system** for expiring medicines.

## What it does

- Every medicine has an expiry date. A daily scheduled job checks all of them and
  buckets each into `EXPIRED`, `CRITICAL` (≤30 days left) or `NEAR_EXPIRY` (≤90 days left).
- If there's anything to report, it sends **one real email** (via SMTP) with an
  HTML summary table to the configured recipient(s).
- It will not re-email you about the same medicine on the same day, even if the
  job runs more than once (restart, manual trigger, etc.) — this is tracked in
  the `notification_logs` table.
- You can also trigger a check on demand: `POST /api/notifications/check-expiry`.

## Requirements

- Java 17+
- Maven 3.9+ (or use your IDE's built-in Maven support)

## Run it

```bash
cd backend
mvn spring-boot:run
```

The API starts on `http://localhost:8080`. It uses an in-memory H2 database by
default (no setup needed) and seeds a few demo medicines/suppliers on startup —
including one already-expired item and one expiring in 15 days, so you can see
a real alert email fire immediately if `run-on-startup` is left `true`.

H2 console (to inspect the seeded data): `http://localhost:8080/h2-console`
(JDBC URL: `jdbc:h2:mem:medistock`, user `sa`, empty password).

## Setting up real email sending (SMTP)

The mail sender is fully wired up (`spring-boot-starter-mail` + `JavaMailSender`),
but it needs real credentials via environment variables — nothing is hard-coded.

### Using Gmail (most common for testing)

1. Turn on 2-Step Verification on the Google account you'll send from.
2. Create an **App Password**: Google Account → Security → 2-Step Verification →
   App passwords. Generate one for "Mail". You'll get a 16-character code.
3. Set these environment variables before starting the app:

```bash
export SMTP_HOST=smtp.gmail.com
export SMTP_PORT=587
export SMTP_USERNAME=youraddress@gmail.com
export SMTP_PASSWORD=your16charapppassword     # NOT your normal Gmail password
export NOTIFICATION_RECIPIENT_EMAILS=pharmacy-manager@example.com,owner@example.com
export NOTIFICATION_FROM_EMAIL=youraddress@gmail.com

mvn spring-boot:run
```

### Using any other SMTP provider (Outlook, SendGrid, Mailgun, your company mail server, etc.)

Just point `SMTP_HOST` / `SMTP_PORT` / `SMTP_USERNAME` / `SMTP_PASSWORD` at that
provider's SMTP details — the code itself doesn't need to change.

If `SMTP_USERNAME`/`SMTP_PASSWORD` are left empty, the app still starts fine;
sending will simply fail and get logged (`EmailService` catches `MessagingException`
and logs the error instead of crashing the scheduler).

## Configuration reference (`src/main/resources/application.yml`)

| Setting | Env var | Default | Meaning |
|---|---|---|---|
| `medistock.notification.recipient-emails` | `NOTIFICATION_RECIPIENT_EMAILS` | `pharmacy-manager@example.com` | who gets alert emails (comma-separated) |
| `medistock.notification.from-email` | `NOTIFICATION_FROM_EMAIL` | same as `SMTP_USERNAME` | the "From" address |
| `medistock.notification.near-expiry-threshold-days` | – | `90` | days-left cutoff for "near expiry" |
| `medistock.notification.critical-threshold-days` | – | `30` | days-left cutoff for "critical" |
| `medistock.notification.check-cron` | – | `0 0 8 * * *` | when the daily job runs (8 AM) |
| `medistock.notification.run-on-startup` | – | `true` | also run one check a few seconds after boot |

## API endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/medicines` | list all medicines |
| POST | `/api/medicines` | create a medicine |
| PUT | `/api/medicines/{id}` | update a medicine |
| DELETE | `/api/medicines/{id}` | delete a medicine |
| GET | `/api/suppliers` | list all suppliers |
| POST/PUT/DELETE | `/api/suppliers/...` | manage suppliers |
| POST | `/api/notifications/check-expiry` | run an expiry check right now and email if needed |

## Switching to PostgreSQL for production

Add these env vars and set `spring.datasource.url` to a Postgres JDBC URL
(the `postgresql` driver dependency is already in `pom.xml`):

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/medistock
export SPRING_DATASOURCE_USERNAME=medistock
export SPRING_DATASOURCE_PASSWORD=yourpassword
```

## Connecting the frontend

The frontend currently runs entirely on mock data (see `frontend/src/App.jsx`).
CORS is already configured (`config/CorsConfig.java`) to allow
`http://localhost:5173`. Point the frontend's fetch calls at
`http://localhost:8080/api/...` to wire it up to this backend.
