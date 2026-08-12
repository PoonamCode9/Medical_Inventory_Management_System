# 💊 MediStock — Medical Inventory Management System

A full-stack web application for managing medicine inventory,
tracking stock availability, monitoring expiry dates,
maintaining supplier records, and generating inventory analytics.

---

## 🚀 Tech Stack

### Backend
- Java 17
- Spring Boot 3.5.16
- Spring Security (JWT Authentication)
- Spring Data JPA
- Hibernate
- PostgreSQL
- JavaMailSender (Email Notifications)
- Maven

### Frontend
- React.js
- React Router DOM
- Axios
- Recharts (Analytics Charts)
- jsPDF (Report Generation)

### Tools
- VS Code
- IntelliJ IDEA
- Git & GitHub
- Docker & Docker Compose
- Postman
- pgAdmin 4

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT Authentication
- Role Based Access Control
- Three roles — Admin, Pharmacist, Staff
- Secure password hashing with BCrypt

### 💊 Medicine Inventory Management
- Add, Edit, Delete medicines
- Track batch numbers and categories
- Monitor stock quantities
- Automatic stock status (IN_STOCK, LOW_STOCK, OUT_OF_STOCK)
- Medicine search and filtering

### 🏢 Supplier Management
- Add and manage suppliers
- Supplier dropdown in medicine form
- Purchase order tracking
- Automatic stock update on delivery

### 📊 Stock Monitoring
- Real time stock tracking
- Low stock alerts (quantity < 10)
- Out of stock notifications
- Stock movement history

### ⏰ Expiry Tracking
- Medicine expiry monitoring
- Expiring soon alerts (30 days)
- Already expired medicines list
- Expiry reports

### 🔔 Notification System
- In-app notification bell
- Email notifications (JavaMailSender)
- Low stock email alerts
- Expiry email alerts
- Purchase order alerts
- Auto scheduled alerts (every hour)

### 📈 Analytics Dashboard
- Stock distribution pie chart
- Category wise bar chart
- Supplier wise bar chart
- Purchase order status chart
- Complete inventory statistics

### 📄 Report Generation
- Medicine inventory PDF report
- Supplier PDF report
- Stock history PDF report
- Purchase orders PDF report
- Expiry PDF report

### 👥 User Management (Admin only)
- Add Pharmacists and Staff
- Change user roles
- Delete users

---

## 🏗️ Project Structure

---

## 🗄️ Database Schema

### Tables
- **users** — User credentials and roles
- **roles** — Role definitions
- **medicines** — Medicine inventory
- **categories** — Medicine categories
- **suppliers** — Supplier information
- **stock_logs** — Stock movement history
- **purchase_orders** — Purchase order tracking
- **notifications** — System notifications

---

## 🔌 API Endpoints

### Authentication

### Medicines

### Suppliers

### Categories

### Stock Logs

### Purchase Orders

### Notifications

### Analytics

### Users

---

## ⚙️ Setup Instructions

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- PostgreSQL 16
- Maven

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/springboardmentor5555e-ctrl/Medical_Inventory_Management_System
cd medical-inventory-management/backend
```

2. Configure database in `application.properties`
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/medistock_db
spring.datasource.username=postgres
spring.datasource.password=yourpassword
```

3. Run backend
```bash
./mvnw spring-boot:run
```

Backend runs on `http://localhost:8080`

### Frontend Setup

1. Go to frontend folder
```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

---

## 👤 Default Roles

| Role | Access |
|------|--------|
| Admin | Full access — all features |
| Pharmacist | Medicine management — no delete |
| Staff | View only — read access |

---

## 🐳 Docker Setup

```bash
docker-compose up --build
```

---

## 👩‍💻 Developer

**Sanjana Nyamagoud**
Internship Project — MediStock Medical Inventory Management

---

## 📅 Milestones

| Milestone | Description | Status |
|-----------|-------------|--------|
| Milestone 1 | Database Design, Backend Setup, JWT Auth | ✅ Complete |
| Milestone 2 | Inventory, Suppliers, Role Dashboards | ✅ Complete |
| Milestone 3 | Notifications, Analytics, Reports, Emails | ✅ Complete |
| Milestone 4 | Testing, Docker, Deployment | 🔄 In Progress |

