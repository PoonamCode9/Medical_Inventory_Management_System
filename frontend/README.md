MediStock -- Medical Inventory Management Platform

📌 Project Overview

MediStock is a web-based Medical Inventory Management Platformdesigned to help hospitals, pharmacies, and healthcare organizationsmanage medicines, suppliers, inventory, stock movement, sales, expirydates, notifications, and reports from a centralized system.

The platform provides separate access for ADMIN, PHARMACIST, andSTAFF users and uses secure authentication and role-based access tocontrol available operations.

🎯 Objectives

The main objectives of MediStock are:

Manage medicine information in a centralized database.

Manage supplier information.

Monitor available medicine stock.

Identify low-stock medicines.

Track medicine expiry dates.

Maintain stock movement logs.

Support medicine sales for pharmacists.

Generate inventory-related notifications.

Provide dashboards and reports.

Secure the system using authentication and role-based access.

👥 User Roles

1. ADMIN

The administrator has the highest level of access.

Features: - Admin dashboard - Add, edit, view, and managemedicines - Add and manage suppliers - Manage users - View inventorystatistics - Monitor low-stock medicines - Monitor expired medicines -View notifications - View reports and analytics

2. PHARMACIST

The pharmacist handles medicine and sales-related operations.

Features: - View medicine stock - Sell medicines - View saleshistory - Check medicine expiry status - View notifications - Monitorinventory information

3. STAFF

Staff access is primarily view-oriented.

Features: - View medicines - View suppliers - View available stock -View low-stock alerts - View expiry alerts - View notifications - Viewreports where permitted

🏗️ System Architecture

                    ┌──────────────────────┐
                    │      React UI        │
                    │  HTML / CSS / JS     │
                    └──────────┬───────────┘
                               │
                           Axios / REST
                               │
                    ┌──────────▼───────────┐
                    │   Spring Boot API    │
                    │ Controllers / JWT    │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │    Service Layer     │
                    │ Business Logic       │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │ Repository / JPA     │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │     PostgreSQL       │
                    └──────────────────────┘

🛠️ Technology Stack

Frontend

React.js

JavaScript

HTML5

CSS3

React Router

Axios

React Icons

Chart.js

Backend

Java 21

Spring Boot

Spring Data JPA

Spring Security

JWT Authentication

Maven

Database

PostgreSQL

Development Tools

Visual Studio Code

Git

GitHub

npm

Maven

📂 Main Project Structure

Medical-Inventory-Management-Platform/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/medistock/demo/
│   │       │       ├── controller/
│   │       │       ├── entity/
│   │       │       ├── repository/
│   │       │       ├── service/
│   │       │       ├── security/
│   │       │       └── dto/
│   │       └── resources/
│   │
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── public/
│
└── README.md

🗄️ Database Modules

The system is designed around the following major data modules:

Module              Purpose

users             Stores user accounts and rolesmedicines         Stores medicine details, batches and datessuppliers         Stores supplier informationinventory         Tracks current stock quantitiesstock_logs        Records stock movementspurchase_orders   Handles procurement informationexpiry_tracking   Supports expiry monitoringnotifications     Stores inventory alertssales             Stores medicine sales historyreports           Supports inventory reporting

🔐 Authentication & Security

MediStock uses authentication and authorization to protect inventoryoperations.

Security features include:

JWT-based authentication

Role-based access

Protected REST API endpoints

Password authentication

Stateless session management

CORS configuration

Admin-specific authentication flow

The frontend sends the authenticated user's token with protected APIrequests.

💊 Medicine Management

Medicine records can contain important information such as:

Medicine name

Batch number

Manufacture date

Expiry date

Quantity

Minimum stock level

Supplier information

Medicine category/details

The system uses this information to support inventory monitoring andalerts.

📦 Inventory Management

The inventory module provides visibility into current stock.

Important inventory operations include:

Adding medicine records.

Maintaining available quantities.

Updating stock.

Recording stock movements.

Detecting low-stock medicines.

Supporting medicine sales.

Reflecting updated quantities on dashboards.

⚠️ Low-Stock Monitoring

Each medicine can have a minimum stock threshold.

When available stock reaches or falls below the configured threshold,the system can identify the medicine as low stock and generate anappropriate notification.

This helps users take replenishment action before medicine availabilitybecomes critical.

⏰ Expiry Tracking

The expiry module helps classify medicines according to expiry status.

Typical categories include:

Expired -- medicines whose expiry date has passed.

Near Expiry -- medicines approaching their expiry date.

Safe -- medicines with sufficient remaining shelf life.

This helps reduce the risk of accidentally using or selling expiredmedicines.

🔔 Notifications

MediStock supports inventory-related notifications such as:

Low-stock alerts

Expiry alerts

Inventory activity notifications

The interface can display unread notification counts and allownotifications to be marked as read.

💰 Medicine Sales

The pharmacist can sell medicines through the sales module.

The sales workflow includes:

Select Medicine
      ↓
Enter Quantity
      ↓
Validate Available Stock
      ↓
Create Sale
      ↓
Update Inventory
      ↓
Record Sales History
      ↓
Generate Relevant Notification

📊 Dashboard

The dashboard provides an overview of the current inventory state.

Important dashboard indicators include:

Total medicines

Available stock

Low-stock medicines

Expired medicines

Notifications

Inventory analytics

Different dashboards can be provided according to the user's role.

🖥️ Main Frontend Pages

The application includes pages/modules such as:

Login

Register

Admin Dashboard

Staff Dashboard

Pharmacist Dashboard

Add Medicine

View Medicines

Add Supplier

View Suppliers

Manage Users

Sell Medicine

View Stock

Expiry Check

Sales History

Reports

Notifications

⚙️ Installation & Setup

Prerequisites

Install the following before running the project:

Java 21

Maven

Node.js

npm

PostgreSQL

Git

1. Clone the Repository

git clone <repository-url>
cd Medical-Inventory-Management-Platform

Replace <repository-url> with the actual GitHub repository URL.

2. Configure PostgreSQL

Create a PostgreSQL database for the application.

Example:

CREATE DATABASE medistock;

Update the Spring Boot database configuration with your PostgreSQLusername, password, database name, and port.

Example configuration:

spring.datasource.url=jdbc:postgresql://localhost:5432/medistock
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

Do not commit real passwords, JWT secrets, API keys, or othercredentials to GitHub.

3. Start the Backend

Navigate to the backend directory:

cd backend

Run:

mvn spring-boot:run

The backend will start on the configured Spring Boot port.

4. Start the Frontend

Open another terminal and navigate to the frontend:

cd frontend

Install dependencies:

npm install

Start the React application:

npm start

The frontend will start on the configured React development port.

🔗 Frontend--Backend Communication

The React frontend communicates with the Spring Boot backend throughREST APIs.

Example API pattern:

Frontend
   ↓
Axios
   ↓
Spring Boot REST Controller
   ↓
Service
   ↓
Repository
   ↓
PostgreSQL

Authentication tokens are attached to protected API requests.

🧪 Testing the Application

Recommended testing flow:

Register a user.

Login using valid credentials.

Verify role-based redirection.

Add a supplier as an authorized user.

Add medicines.

Verify medicine list and stock.

Test low-stock detection.

Test expiry tracking.

Test notifications.

Login as pharmacist and test medicine sales.

Verify stock quantity after a sale.

Verify dashboards and reports.

🚨 Common Issues

401 Unauthorized

Possible causes:

Missing JWT token.

Expired token.

Invalid authentication credentials.

Token not included in the Axios request.

403 Forbidden

Possible causes:

User does not have the required role.

Endpoint is protected by Spring Security.

CORS/security configuration is incorrect.

500 Internal Server Error

Check:

Spring Boot console logs.

PostgreSQL database structure.

Entity relationships.

Request payload.

Service-layer exceptions.

Dashboard Shows Zero Values

Check:

Backend dashboard endpoint.

PostgreSQL data.

JWT authorization header.

Frontend API base URL.

Browser Network tab.

Backend response payload.

🔄 Inventory Workflow

Login
  ↓
Role Verification
  ↓
Dashboard
  ↓
Medicine / Supplier Management
  ↓
Inventory Monitoring
  ↓
Low Stock / Expiry Detection
  ↓
Notifications
  ↓
Sales / Stock Operations
  ↓
Reports & Analytics

📈 Future Scope

Future improvements can include:

Barcode and QR-code scanning.

Automated purchase recommendations.

Email and SMS notifications.

Advanced sales forecasting.

Inventory demand prediction.

Cloud deployment.

Mobile-friendly pharmacist interface.

Advanced analytics.

Automated supplier management.

Exportable audit reports.

🌟 Key Benefits

MediStock aims to provide:

Centralized inventory management.

Better medicine stock visibility.

Faster identification of low-stock items.

Better expiry monitoring.

Reduced manual work.

Role-based access control.

Organized sales and stock history.

Real-time dashboard visibility.

Improved inventory decision-making.

📌 Project Status

Project: MediStock -- Medical Inventory Management Platform

Type: Full-Stack Web Application

Frontend: React.js

Backend: Spring Boot

Database: PostgreSQL

Authentication: JWT

Status: Development / Academic Project

👩‍💻 Project Purpose

MediStock is developed as an academic full-stack software projectdemonstrating practical implementation of:

Frontend development

REST API development

Database management

Authentication and authorization

Role-based application design

Inventory management

Notifications

Dashboard analytics

Full-stack integration

📄 License

This project is intended for educational and academic purposes. Add theappropriate license here if the project is later released asopen-source.

🙏 Acknowledgement

This project demonstrates how modern web technologies can be combined tobuild a practical medical inventory management solution with a focus onusability, security, inventory visibility, and operational efficiency.
