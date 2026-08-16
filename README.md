# 🏥 MediStock - Enterprise Medical Inventory Management System

**MediStock** is a full-stack, enterprise-grade medical inventory management platform built to streamline core operations for pharmacies and healthcare centers. It provides centralized control over medicine catalogs, real-time stock levels, suppliers, purchase orders, sales transactions, expiry alerts, user access, and analytics.

---

## ✨ Core Features

* 🔒 **Authentication & Authorization:** Secure JWT authentication, BCrypt password encryption, Google OAuth2 integration, OTP-based password reset, and fine-grained Role-Based Access Control (RBAC).
* 💊 **Medicine Management:** Complete CRUD operations for medicine inventory including batch tracking, categories, unit prices, expiry dates, and supplier mapping.
* 📦 **Real-Time Inventory Tracking:** Instant monitoring of available stock, low-stock alerts, damaged item logs, and top-moving inventory items.
* ⚠️ **Automated Expiry & Stock Alerts:** Configurable threshold monitoring for low-stock levels and urgent/approaching expiry notifications.
* 🏭 **Supplier & Order Management:** Manage vendor profiles and process multi-item purchase orders with stock intake and damaged item registration.
* 💰 **Sales & Stock Movement Logs:** Record sales transactions and maintain complete audit logs of stock changes (before/after quantities, timestamps, user actions).
* 🔔 **Multi-Channel Notifications:** In-app alert management (unread counts, mark as read) alongside automated email alert dispatchers.
* 📊 **Analytics & Reporting:** Visual insights via interactive Recharts and automated report downloads in **PDF** (iText) and **Excel** (Apache POI) formats.
* ⚙️ **System Configuration:** Global settings for pharmacy profile details, license numbers, admin notification channels, and stock thresholds.

---

## 🛠 Tech Stack

### Backend
* **Language & Framework:** Java 26, Spring Boot 4.1.0
* **Security:** Spring Security, JWT, Google OAuth2
* **Database & Persistence:** PostgreSQL, Spring Data JPA, Hibernate
* **Reporting Engines:** iText (PDF Generation), Apache POI (Excel Generation)
* **Build Tool:** Maven Wrapper (`./mvnw`)

### Frontend
* **Core Framework:** React 19 (Vite 8)
* **Routing:** React Router DOM v7
* **Styling & UI:** Tailwind CSS v4, Lucide React Icons
* **Data Visualization:** Recharts
* **HTTP & Notifications:** Axios, React Hot Toast

---

## 🏗 System Architecture

```text
                  ┌─────────────────────────────┐
                  │       React Frontend        │
                  │  (Vite + Tailwind + Axios)  │
                  │                             │
                  │ Dashboard, Medicines,       │
                  │ Inventory, Suppliers,       │
                  │ Orders, Sales, Reports      │
                  └──────────────┬──────────────┘
                                 │
                            REST API / JWT
                                 │
                                 ▼
                  ┌─────────────────────────────┐
                  │     Spring Boot Backend     │
                  │                             │
                  │ Controllers & Services      │
                  │ Repositories & DTOs         │
                  │ JWT / OAuth2 Security       │
                  │ Scheduled Alert Tasks       │
                  └──────────────┬──────────────┘
                                 │
                          Spring Data JPA
                                 │
                                 ▼
                  ┌─────────────────────────────┐
                  │     PostgreSQL Database     │
                  └─────────────────────────────┘
```

## 🔑 Role-Based Access Control (RBAC)

| Feature / Action | Admin | Pharmacist | Staff |
| :--- | :---: | :---: | :---: |
| View Medicines | ✅ | ✅ | ✅ |
| Manage Medicines | ✅ | ✅ | ❌ |
| View Inventory | ✅ | ✅ | ✅ |
| Manage Inventory | ✅ | ✅ | ❌ |
| Manage Suppliers | ✅ | ✅ | ❌ |
| Purchase Orders | ✅ | ✅ | 👁️ View |
| Receive Stock | ✅ | ✅ | ❌ |
| Process Sales | ✅ | ✅ | ✅ |
| View Stock Logs | ✅ | ✅ | ✅ |
| Generate Reports | ✅ | ✅ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |
| System Settings | ✅ | ❌ | ❌ |

---

## 📂 Directory Structure

```text
MediStock/
├── backend/                        # Spring Boot Application
│   ├── src/main/java/com/medistock/
│   │   ├── config/                 # Security & Application Configurations
│   │   ├── controller/             # REST Endpoints (Auth, Medicines, Suppliers, Reports, etc.)
│   │   ├── dto/                    # Request & Response Payload Models
│   │   ├── entity/                 # JPA Database Entities (User, Medicine, Supplier, StockLog, etc.)
│   │   ├── exception/              # Custom Global Exception Handling
│   │   ├── report/                 # PDF & Excel Report Generation Services
│   │   ├── repository/             # Spring Data Repositories
│   │   ├── scheduler/              # Automated Alert Schedulers
│   │   ├── security/               # JWT Utilities & Authentication Filters
│   │   └── service/                # Core Business Logic Layer
│   └── src/main/resources/
│       └── application.properties  # Base Configuration
│
└── frontend/                       # React Application
    ├── src/
    │   ├── api/                    # Axios Client Setup
    │   ├── components/             # Reusable UI Elements (Navbar, Modals, Tables)
    │   ├── pages/                  # Views (Dashboard, Medicines, Suppliers, Reports, etc.)
    │   ├── App.jsx                 # Routing Setup
    │   └── main.jsx                # Entrypoint
    └── vite.config.js              # Vite Build Config
```

## ⚡ Prerequisites

Make sure you have the following installed on your system:

- **Java Development Kit (JDK):** JDK 26
- **Node.js:** v24.13.0 (or higher)
- **npm:** 11.6.2 (or higher)
- **Maven:** Maven Wrapper bundled in `backend/` (`./mvnw`), separate installation not required

---

## 🚀 Getting Started

### 1. Database Setup
Start your PostgreSQL service and create a new database named medical_inventory:

```sql
CREATE DATABASE medical_inventory
```
Configure your database connection credentials in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/medical_inventory
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
```

### 2. Run Backend Application
Navigate to the backend directory and launch the Spring Boot application using the Maven Wrapper:

```bash
cd backend
./mvnw spring-boot:run
```

### 3. Run Frontend Application
Open a new terminal window, navigate to the frontend directory, install npm packages, and launch Vite dev server:

```bash
cd frontend
npm install
npm run dev
```

The React web application will start at http://localhost:5173.

## ⚙️ Environment Variables

The backend application uses environment variables for security configurations, database connections, SMTP mailers, and Google OAuth2 credentials.

| Variable | Required | Default / Example Value | Description |
| :--- | :---: | :--- | :--- |
| `DB_URL` | Yes | `jdbc:postgresql://localhost:5432/medical_inventory` | PostgreSQL database connection URL |
| `DB_USERNAME` | Yes | `postgres` | Database username |
| `DB_PASSWORD` | Yes | `your_db_password` | Database user password |
| `JWT_SECRET` | Yes | `your_super_secret_jwt_key` | Secret key used to sign and verify JWT tokens |
| `MAIL_USERNAME` | Optional | `your-email@gmail.com` | Gmail address used for sending automated email notifications |
| `MAIL_PASSWORD` | Optional | `your_16_digit_app_password` | Gmail 16-digit App Password (not standard account password) |
| `ADMIN_EMAIL` | Optional | Defaults to `${MAIL_USERNAME}` | Admin recipient email for urgent inventory alerts |
| `GOOGLE_CLIENT_ID` | Optional | `your_google_client_id` | Google OAuth2 Client ID for social login |
| `GOOGLE_CLIENT_SECRET` | Optional | `your_google_client_secret` | Google OAuth2 Client Secret |

---

### Key Application Properties (Built-in)
* **Server Port:** `8080` (Spring Boot Default)
* **Frontend CORS Origin:** `http://localhost:5173`
* **JWT Expiration:** `86400000 ms` (24 Hours)
* **Database Management:** `hibernate.ddl-auto=update`
---

## 📡 API Endpoints Summary

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user account.
- `POST /api/auth/login` - Authenticate user & receive JWT token.
- `POST /api/auth/forgot-password` - Request password reset OTP.

### 💊 Medicines & Inventory (`/api/medicines`, `/api/inventory`)
- `GET /api/medicines` - Fetch all medicines.
- `POST /api/medicines` - Create a new medicine entry.
- `PUT /api/medicines/{id}` - Update existing medicine record.
- `DELETE /api/medicines/{id}` - Remove medicine from catalog.
- `POST /api/inventory/update` - Update stock level manually.

### 🏭 Suppliers & Purchase Orders (`/api/suppliers`, `/api/orders`)
- `GET /api/suppliers` - List all registered suppliers.
- `POST /api/orders` - Create a new purchase order.
- `POST /api/orders/{id}/receive` - Receive stock against purchase order.

### 🔔 Notifications & Reports (`/api/notifications`, `/api/reports`)
- `GET /api/notifications` - Get low-stock and expiry notification alerts.
- `GET /api/reports/pdf` - Download generated PDF inventory report.
- `GET /api/reports/excel` - Download generated Excel stock report.

---

## ⏰ Background Tasks & Automation

MediStock integrates automated Spring Boot background tasks:
- **Low-Stock Scanner:** Regularly compares inventory quantity against low-stock threshold settings.
- **Expiry Monitor:** Scans expiry medicines based on expiry threshold in settings.
- **Alert Dispatcher** Automatically aggregates pending notifications and dispatches digest emails to system administrators.
---

## 🤝 Contributing

Contributions are always welcome! Follow these steps to contribute:
1. Fork the repository.
2. Create your Feature Branch (git checkout -b feature/NewFeature)
3. Commit your Changes (git commit -m 'Add NewFeature')
4. Push to the Branch (git push origin feature/NewFeature)
5. Open a Pull Request.