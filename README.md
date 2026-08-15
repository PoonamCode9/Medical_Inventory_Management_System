# 🏥 OM Medical Inventory & Management System

> A state-of-the-art, high-performance enterprise solution for modern healthcare facilities, pharmacies, and clinics. 

---

## 🌟 The Vision & What It Solves

Pharmacies, hospitals, and medical organizations face critical operational hurdles daily: stock wastage due to unexpected drug expiration, supply-chain bottlenecks, manual reporting errors, and disconnected systems. 

**OM Medical** bridges these gaps with a fully integrated, omnichannel ecosystem:
- **⏳ Expiry Control & Proactive Safety:** Automated background workers monitor expiration dates, sending early warnings (30-day countdowns) and automated email reports, keeping patients safe and reducing financial waste.
- **📦 Precision Stock Tracking:** Dynamic stock adjustments automatically compute deltas from recorded Sales & Purchases, eliminating manual count drift.
- **🛡️ Multi-Role Cooperation:** Custom, secure workspaces tailored for **Administrators** (full audits and control), **Pharmacists** (replenishment and stock health), and **Staff/Assistants** (quick searches & customer checkout).
- **📱 Omnichannel Availability:** Run a highly polished Web Portal for administrative and desk work alongside a native iOS & Android Mobile App for quick check-ins, floor walks, and stock audits.

---

## 🏗️ Project Architecture & Structure

The repository is organized as a decoupled monorepo, separating concerns and enabling scalable client deployment.

```bash
om_medical/
├── backend/                       # ☕ Spring Boot REST Service & Logic
│   ├── src/main/java/.../
│   │   ├── controller/            # REST API endpoints (Admin, Pharmacy, Auth)
│   │   ├── Dto/                   # Secure Data Transfer Objects
│   │   ├── entity/                # Database mapping entities (JPA)
│   │   ├── repository/            # DB communication interfaces (Spring Data)
│   │   ├── security/              # JWT filter and Spring Security context
│   │   └── service/               # Core business processes, Mailers, & Tasks
│   └── pom.xml                    # Maven configuration and dependencies
│
├── frontend/                      # 💻 React Web SPA
│   ├── src/
│   │   ├── assets/                # Visual and design assets
│   │   ├── components/            # Dashboards (Admin, Pharmacist, Staff)
│   │   ├── App.jsx                # Router & central controller
│   │   └── main.jsx               # Render and root initiation
│   ├── package.json               # Frontend dependencies (React 19, Vite)
│   └── vite.config.js             # Vite build configuration
│
└── mobile/                        # 📱 React Native Client (Expo)
    ├── src/
    │   ├── api/                   # Axios-based secure HTTP clients
    │   ├── components/            # Reusable UI elements (AppButton, StatCard...)
    │   ├── context/               # Global state (Auth, Context)
    │   ├── navigation/            # Bottom-tab and stack navigation setup
    │   └── screens/               # Screen components (Inventory, Expiry, Sales...)
    ├── app.json                   # Expo application settings
    └── package.json               # Mobile packages & scripts
```

---

## ⚡ Tech Stack & Core Frameworks

### ☕ Backend Core
* **Language & Runtime:** Java 26
* **Web Framework:** Spring Boot Starter WebMVC (REST Services)
* **Security & Authentication:** Spring Security + JSON Web Tokens (JJWT 0.12.6) with custom filter integration
* **Persistence & ORM:** Spring Data JPA + Hibernate
* **Database:** PostgreSQL (production-grade schema, relational database modeling)
* **Automation & Messaging:** Spring Mail (SMTP automation for daily reports) + background Scheduled cron-tasks
* **Utility:** Project Lombok (clean, boilerplate-free boilerplate models)

### 💻 Web Client (Frontend)
* **Base Layer:** React 19 (State management & Hooks)
* **Build Tool:** Vite (Ultra-fast HMR and building pipeline)
* **Styling Framework:** Tailwind CSS v4 (Highly responsive utility-first design)
* **Charts & Analytics:** Recharts (Interactive inventory metrics and sales data)
* **Animations:** Framer Motion (Fluid transitions and modern user feedback)
* **Alerts:** SweetAlert2 (Elegant status dialogs)
* **Quality & Linting:** Oxlint (Speed-optimized modern linter)

### 📱 Mobile App (Native Client)
* **Base Platform:** React Native + Expo (v54.0.0+)
* **Navigation:** React Navigation (Native Bottom-Tabs & Native-Stack setup)
* **API Requests:** Axios (Configured client with automatic bearer tokens)
* **Offline Caching:** Async Storage (Local state preservation)
* **Pickers:** Community DateTimePicker (Native date input controls)

---

## 🛠️ Setup & Running Locally

Ensure you have **Node.js (v20+)**, **Java 26 SDK**, **Maven**, and **PostgreSQL** running locally.

### 1. ☕ Launch Backend Service
```bash
# Navigate to backend
cd backend

# Install dependencies and build project
mvn clean install

# Launch Spring Boot Application
mvn spring-boot:run
```

### 2. 💻 Spin Up Web Dashboard
```bash
# Navigate to frontend
cd frontend

# Install packages
npm install

# Start Vite Development Server
npm run dev
```

### 3. 📱 Open Mobile App (Expo)
```bash
# Navigate to mobile
cd mobile

# Install mobile packages
npm install

# Start Expo bundler
npm run start
```
*Press `a` to load Android Emulator, `i` for iOS Simulator, or scan the QR code with the **Expo Go** app on your physical device.*

---

## 📊 Presentation Deck Included!
An enterprise-grade, slide-by-slide PowerPoint presentation is prepared and ready for your next architectural, stakeholder, or academic review!
* Find it at the workspace root: **`om_medical_presentation.pptx`**

---
🏥 **OM Medical** — Built to keep healthcare inventory precise, safe, and universally accessible.
