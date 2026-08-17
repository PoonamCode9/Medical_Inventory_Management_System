# MediStock — Medical Inventory Management System

MediStock is a full-stack medical inventory management platform designed to help pharmacies, hospitals, and healthcare organizations efficiently manage medicines, stock availability, expiry dates, suppliers, purchases, alerts, analytics, and reports.

## Features

- User authentication and role-based access
- Admin, Pharmacist, and Staff dashboards
- Medicine inventory management
- Add, update, delete, and track medicines
- Batch and stock quantity management
- Supplier and purchase management
- Real-time stock monitoring
- Low-stock and out-of-stock alerts
- Medicine expiry and near-expiry tracking
- Medicine search and filtering
- Inventory and supplier analytics
- Inventory, stock, purchase, and expiry reports
- PDF/Excel report export
- Medicine Assistant Chatbot for Staff

## User Roles

### Admin

- Inventory analytics
- User activity
- Supplier analytics
- Stock movement reports
- System monitoring

### Pharmacist

- Inventory overview
- Low-stock medicines
- Expiring medicines
- Purchase summary
- Supplier insights

### Staff

- Medicine information
- Inventory access
- Stock details
- Medicine Assistant Chatbot

## Technology Stack

### Frontend

- React.js
- JavaScript

### Backend

- Java
- Spring Boot
- Spring Security
- JWT

### Database

- PostgreSQL

### Testing

- JUnit
- Mockito
- Postman
- React Testing Library

### Development & Deployment

- Git
- GitHub
- Docker
- Docker Compose

## System Workflow

1. User logs in.
2. Credentials are authenticated.
3. User role and permissions are verified.
4. The appropriate Admin, Pharmacist, or Staff dashboard is displayed.
5. Users perform inventory, supplier, purchase, and stock operations according to their role.
6. The system monitors stock and expiry information.
7. Alerts and notifications are generated for relevant conditions.
8. Inventory data is used for analytics and reports.
9. Data is stored in the PostgreSQL database.

## Database Design

The PostgreSQL database contains the main entities:

- Users
- Roles
- Medicines
- Suppliers
- Inventory
- Stock Logs
- Purchase Orders
- Purchase Order Items
- Expiry Tracking
- Notifications
- Reports

## Project Structure

```text
MediStock/
├── frontend/
│   └── React application
├── backend/
│   └── Spring Boot application
├── database/
│   └── PostgreSQL schema/scripts
└── README.md
