# MediStock – Medical Inventory Management System

## Project Overview

MediStock is a full-stack Medical Inventory Management System developed to help healthcare organizations efficiently manage medicines, suppliers, stock levels, expiry dates, notifications, reports, and inventory analytics.

The system provides role-based access for Admin, Pharmacist, and Staff users.

---

## Objectives

The main objectives of the project are:

- Manage medicine inventory efficiently
- Manage supplier information
- Monitor stock levels
- Track medicine expiry dates
- Generate low-stock and expiry notifications
- Maintain stock movement history
- Provide inventory reports
- Visualize inventory data using dashboards and charts
- Provide secure role-based access

---

# Milestones

## Milestone 1 – Project Setup and Authentication

The initial milestone focused on setting up the application architecture, database, frontend, backend, and authentication.

### Completed Work

- Created Spring Boot backend application
- Created React frontend application
- Configured PostgreSQL database
- Designed and implemented database entities
- Implemented Spring Data JPA repositories
- Implemented REST APIs
- Implemented user registration
- Implemented user login
- Implemented JWT-based authentication
- Implemented Spring Security
- Implemented role-based access control
- Added Admin, Pharmacist, and Staff roles
- Connected React frontend with Spring Boot backend
- Implemented protected application routes

---

## Milestone 2 – Medicine and Supplier Management

This milestone focused on managing medicines, suppliers, and inventory information.

### Completed Work

### Medicine Management

- Add new medicines
- View medicines
- Update medicine information
- Delete medicines
- Store medicine name, category, manufacturer, batch number, expiry date, unit price, and quantity
- Associate medicines with suppliers
- Search medicines
- Filter medicines by category
- Monitor medicine stock quantities

### Supplier Management

- Add suppliers
- View suppliers
- Update supplier information
- Delete suppliers
- Store supplier name, contact person, phone, email, and address
- Display supplier information in the application

### Inventory

- Track medicine quantities
- Maintain stock information
- Implement stock-related operations
- Maintain stock logs for inventory movements

---

## Milestone 3 – Expiry Tracking and Notifications

This milestone focused on monitoring medicine expiry dates and stock conditions.

### Expiry Tracking

- Implemented medicine expiry tracking
- Identified expired medicines
- Identified medicines expiring soon
- Implemented expiry status classification:
  - VALID
  - EXPIRING_SOON
  - EXPIRED
- Added expiry monitoring to the inventory system

### Stock Monitoring

- Implemented low-stock monitoring
- Configured low-stock threshold
- Generated notifications for medicines reaching low stock
- Implemented medicine-specific low-stock notifications

### Notifications

- Implemented inventory notifications
- Implemented low-stock notifications
- Implemented expiry-related notifications
- Added notification read/unread functionality
- Implemented user-specific notification handling
- Added notification display in dashboards
- Implemented email notification support for low-stock alerts

---

## Milestone 4 – Analytics, Reporting and Visualization

This milestone focused on presenting inventory information through dashboards, reports, and visualizations.

### Dashboard

- Implemented Admin Dashboard
- Implemented Pharmacist Dashboard
- Implemented Staff Dashboard
- Added inventory summary cards
- Added medicine and supplier counts
- Added inventory-related information to dashboards

### Analytics and Visualization

- Added inventory analytics
- Added graphical representation of inventory information
- Added stock-related charts
- Added expiry-related visualization
- Added data visualization to improve inventory monitoring

### Reports

- Implemented medicine inventory reports
- Added PDF report generation
- Added report viewing/download functionality
- Organized inventory information for reporting

### Purchase Orders

- Implemented Purchase Order functionality
- Added purchase order information
- Added supplier-related purchase order details
- Provided appropriate access based on user roles

---

# User Roles and Access

## Admin

Admin has the highest level of access and can:

- Manage medicines
- Manage suppliers
- Manage users
- Monitor inventory
- View notifications
- View reports
- View analytics
- Manage purchase orders

## Pharmacist

Pharmacist access focuses mainly on medicine and stock management:

- View medicines
- Manage/monitor stock
- View suppliers
- View reports
- Monitor expiry information
- View notifications

## Staff

Staff has mainly read-only access to inventory information:

- View medicines
- View purchase orders
- View stock logs
- View reports
- View inventory information
- View notifications
- Manage personal profile

---

# Technology Stack

## Frontend

- React.js
- JavaScript
- HTML
- CSS
- React Router
- Axios
- Vite
- Recharts

## Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- Maven

## Database

- PostgreSQL

## Authentication and Security

- JWT Authentication
- Spring Security
- BCrypt Password Encoding

## Reporting

- iText PDF

---

# Project Structure

```text
medical_inventory_platform/
│
├── backend/
│   └── Spring Boot application
│
├── frontend/
│   └── React application
│
└── README.md