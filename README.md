# 💊 MediStock

## Medical Inventory Management Platform

MediStock is a full-stack web application designed to help pharmacies, hospitals, clinics, and healthcare organizations efficiently manage medicines, inventory, suppliers, purchase orders, sales, notifications, users, and operational analytics.

The platform combines a React.js frontend with a Spring Boot backend and a relational database to provide a centralized system for managing the complete medicine inventory workflow.

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Problem Statement](#-problem-statement)
- [Objectives](#-objectives)
- [Key Features](#-key-features)
- [User Roles](#-user-roles)
- [System Modules](#-system-modules)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Frontend](#-frontend)
- [Backend](#-backend)
- [Database](#-database)
- [Authentication and Security](#-authentication-and-security)
- [Dashboard and Analytics](#-dashboard-and-analytics)
- [Notification System](#-notification-system)
- [Reports and Data Export](#-reports-and-data-export)
- [Sales Management](#-sales-management)
- [Search and Filtering](#-search-and-filtering)
- [Project Milestones](#-project-milestones)
- [Development Workflow](#-development-workflow)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Future Enhancements](#-future-enhancements)
- [Conclusion](#-conclusion)

---

# 📖 Project Overview

MediStock was developed as a centralized medical inventory management platform.

The original project objective was to provide real-time inventory visibility, medicine stock management, expiry monitoring, supplier management, low-stock notifications, and inventory analytics through a web-based system. :contentReference[oaicite:1]{index=1}

The completed system extends this foundation with additional operational functionality including:

- Medicine management
- Inventory and batch management
- Supplier management
- Purchase order management
- Sales management
- User and role management
- Notifications
- Dashboard analytics
- Activity monitoring
- Report generation
- PDF, Excel and CSV exports
- Printing
- Search and filtering
- Role-based application access

---

# 🎯 Problem Statement

Traditional medicine inventory processes can become difficult to manage when stock information, suppliers, purchase records, expiry dates, and sales information are maintained manually or across disconnected systems.

This can result in:

- Difficulty tracking available stock
- Delayed identification of low-stock medicines
- Missed medicine expiry dates
- Poor visibility into supplier activity
- Inefficient purchase management
- Difficulty tracking sales
- Limited operational analytics
- Time-consuming report preparation
- Increased possibility of inventory errors

MediStock addresses these problems by providing a centralized digital platform for managing the complete inventory workflow.

---

# 🎯 Objectives

The major objectives of MediStock are:

1. Develop a full-stack medical inventory management platform.
2. Manage medicine information and categories.
3. Track medicine batches and inventory quantities.
4. Monitor medicine expiry dates.
5. Identify low-stock and out-of-stock items.
6. Manage supplier information.
7. Manage purchase orders.
8. Record and manage medicine sales.
9. Provide dashboards and analytics.
10. Generate inventory and operational reports.
11. Provide notifications for important inventory events.
12. Implement authentication and role-based access.
13. Maintain activity history for system operations.
14. Provide an efficient search and filtering experience.
15. Provide exportable reports for operational use.

The original project specification specifically identifies medicine inventory, expiry monitoring, supplier records, stock updates, low-stock notifications and inventory analytics as core outcomes. :contentReference[oaicite:2]{index=2}

---

# ✨ Key Features

## 💊 Medicine Management

MediStock allows authorized users to:

- Add medicines
- Update medicine information
- Delete medicines
- Manage medicine categories
- Search medicines
- Filter medicines
- View medicine details
- Associate medicines with suppliers

Medicine information includes fields such as medicine name, category, supplier, price and related inventory information. :contentReference[oaicite:3]{index=3}

---

## 📦 Inventory Management

The inventory module provides:

- Batch management
- Quantity tracking
- Manufacturing date tracking
- Expiry date tracking
- Stock status monitoring
- Inventory value calculation
- Stock updates
- Inventory history

The original specification defines inventory management around medicine batches, quantities, manufacturing dates, expiry dates, suppliers and prices. :contentReference[oaicite:4]{index=4}

---

## 🏢 Supplier Management

The supplier module allows users to manage:

- Supplier information
- Contact details
- Email addresses
- Addresses
- Supplied medicines
- Purchase relationships
- Supplier records

Supplier management was defined as one of the core project modules from the initial project specification. :contentReference[oaicite:5]{index=5}

---

## 🛒 Purchase Order Management

MediStock provides functionality for managing purchase orders, including:

- Creating purchase orders
- Viewing purchase orders
- Tracking order quantities
- Tracking suppliers
- Tracking expected delivery dates
- Tracking order status
- Monitoring purchase amounts

Supported order statuses include workflow states such as:

- Pending
- Approved
- Delivered
- Cancelled

---

# 💰 Sales Management

Sales management was added as an extension of the original inventory workflow.

The sales module provides:

- Sale creation
- Medicine selection
- Batch selection
- Quantity tracking
- Customer information
- Unit price calculation
- Total sale amount
- User/seller tracking
- Sale date tracking
- Sales history
- Sales analytics

Sales information can also be incorporated into reporting and analytics workflows.

---

# 🔔 Notification System

MediStock provides automated inventory-related notifications.

The system supports alerts related to:

- Low stock
- Expiring medicines
- Expired medicines
- Inventory conditions
- Purchase-related events

The project specification identifies low-stock alerts, expiry alerts, inventory reminders, purchase alerts and email notifications as notification requirements. :contentReference[oaicite:6]{index=6}

The notification workflow also provides recommended actions depending on the alert type, such as restocking low-stock medicine, using existing near-expiry stock, or removing expired stock. :contentReference[oaicite:7]{index=7}

---

# 👥 User Roles

MediStock uses role-based access to separate application functionality between different types of users.

The original specification identifies the following roles:

### Administrator

Responsible for:

- User management
- System monitoring
- Inventory analytics
- Supplier analytics
- Stock monitoring
- Reports
- System-wide management

### Pharmacist

Responsible for:

- Medicine management
- Inventory management
- Supplier interaction
- Purchase orders
- Stock monitoring
- Notifications

### Staff

Responsible for permitted operational inventory activities according to their assigned access level.

The role structure of Admin, Pharmacist and Staff is defined in the project specification. :contentReference[oaicite:8]{index=8}

---

# 🏗️ System Architecture

MediStock follows a layered full-stack architecture.

```text
                    ┌─────────────────────────┐
                    │       User / Client     │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      React Frontend     │
                    │                         │
                    │  Pages / Components     │
                    │  Forms / Tables         │
                    │  Dashboards / Charts    │
                    └────────────┬────────────┘
                                 │
                              HTTP/API
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │    Spring Boot Backend  │
                    │                         │
                    │ Controllers             │
                    │ Services                │
                    │ DTOs                    │
                    │ Repositories            │
                    │ Security                │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │    Relational Database  │
                    │                         │
                    │ Users                   │
                    │ Medicines               │
                    │ Suppliers               │
                    │ Inventory               │
                    │ Purchases               │
                    │ Notifications           │
                    │ Sales                   │
                    └─────────────────────────┘