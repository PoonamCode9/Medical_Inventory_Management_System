# MediStock — Medical Inventory Management System

MediStock is a full-stack **Medical Inventory Management System** designed to help pharmacies, medical stores, and healthcare organizations manage medicines, inventory, suppliers, purchase orders, dispensing, staff activities, and stock-related alerts from a centralized system.

The system uses role-based access so that each user can perform the operations relevant to their responsibilities.

## ✨ Features

### 🔐 Role-Based Access Control

MediStock supports four major roles:

- **Admin**
  - Full system access
  - Manage medicines, suppliers, users, inventory, purchase orders, and system activities
  - Monitor overall inventory and dashboard analytics
  - Receive stock and expiry-related alerts
  - Assign Tasks to Staff

- **Pharmacist**
  - Manage medicine dispensing
  - Create purchase requests/orders
  - Monitor medicine inventory
  - Handle pharmacy-related operations
  - Receive stock and expiry-related notifications
  - Assign Tasks to Staff

- **Staff**
  - Manage warehouse/inventory operations
  - Receive incoming medicine consignments
  - Confirm received inventory
  - Perform assigned inventory-related tasks

- **Supplier**
  - View purchase requests
  - Approve or decline supply requests
  - Manage supplied medicines and orders

---

## 💊 Medicine & Inventory Management

- Add, update, view, and manage medicines
- Store medicine details such as:
  - Medicine name
  - Batch number
  - Category
  - Supplier
  - Quantity
  - Manufacturing date
  - Expiry date
  - Price
- Track available stock
- Monitor medicine expiry dates
- Identify medicines approaching low-stock levels
- Maintain supplier–medicine relationships
- View inventory information through a centralized dashboard

---

## 📦 Purchase Order Management

MediStock follows a structured purchase workflow:

```text
Pharmacist
    ↓
Creates Purchase Order
    ↓
Admin
    ↓
Approves Purchase Order
    ↓
Supplier
    ↓
Approves / Declines Supply
    ↓
Staff
    ↓
Receives Medicine Consignment
    ↓
Inventory Updated
```

This workflow helps maintain a clear record of who created, approved, supplied, and received an order.

---

## 💉 Medicine Dispensing

The dispensing module allows authorized users to record medicines that are dispensed.

When a medicine is dispensed:

- The inventory quantity is reduced.
- The dispensing transaction is recorded.
- The user who performed the dispensing is stored.
- Dispensing information can be monitored from the management dashboard.

---

## ⏰ Expiry Management

MediStock provides expiry monitoring for medicines.

The system can identify:

- Medicines approaching their expiry date
- Medicines that have already expired

When a medicine reaches an expiry-related condition, the system can notify relevant users through dashboard notifications and email alerts.

This helps administrators and pharmacists take action before expired medicines remain in active inventory.

---

## 🔔 Notifications

The notification system keeps users informed about important inventory events.

Examples include:

- Medicine approaching expiry
- Medicine already expired
- Medicine reaching low-stock level
- Other important inventory-related events

Notifications are available for relevant users through their respective dashboards.

---

## ✅ Task Management

Admin and pharmacists can assign simple tasks to staff members.

Example tasks:

- Receive incoming inventory
- Check received medicines
- Remove expired medicines
- Perform warehouse-related activities

The task system provides a simple way to track staff responsibilities without introducing unnecessary complexity.

---

## 📊 Dashboard & Analytics

The system provides role-specific dashboards containing relevant information and KPIs.

Dashboard information can include:

- Total medicines
- Inventory quantity
- Stock value
- Low-stock medicines
- Expiring medicines
- Purchase order information
- Dispensing information
- Recent activities
- Notifications
- Tasks

Each dashboard is designed according to the responsibilities of the logged-in role.

---

## 🗃️ Supplier Management

Supplier management allows the system to maintain information about medicine suppliers.

Supplier records can contain:

- Supplier name
- Contact number
- Email
- Address
- Supplied medicines

A relationship between suppliers and medicines allows the system to determine which medicines are supplied by which supplier.

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- JavaScript
- HTML5
- CSS3

### Backend
- Java
- SpringBoot
- REST APIs

### Database
- PostgreSQL

### Development Tools
- Git
- GitHub
- VS Code

> Update this section if your final implementation uses additional libraries or technologies.

---

## 🏗️ High-Level Architecture

```text
                    ┌─────────────────────┐
                    │       Users         │
                    │ Admin / Pharmacist  │
                    │ Staff / Supplier    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    React Frontend   │
                    │ Dashboards & Forms  │
                    └──────────┬──────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Java / SpringBoot   │
                    │ Backend             │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    PostgreSQL DB    │
                    │ Medicines / Users   │
                    │ Orders / Inventory  │
                    │ Suppliers / Tasks   │
                    └─────────────────────┘
```

---

## 🗂️ Core Modules

| Module | Purpose |
|---|---|
| Authentication & Authorization | Secure login and role-based access |
| Medicine Management | Manage medicine records |
| Inventory Management | Track stock and inventory |
| Supplier Management | Manage suppliers and supplied medicines |
| Purchase Orders | Manage the medicine procurement workflow |
| Dispensing | Record medicine dispensing and reduce stock |
| Expiry Management | Monitor medicines approaching/after expiry |
| Notifications | Inform users about important inventory events |
| Task Management | Assign and track staff tasks |
| Dashboards | Display role-specific KPIs and activities |
| Reports & Analytics | Monitor inventory and operational information |

---

## 🔄 Purchase & Inventory Flow

A typical inventory procurement process works as follows:

1. Pharmacist creates a purchase order.
2. Admin reviews and approves the order.
3. Supplier receives the request.
4. Supplier approves or declines the supply.
5. Approved medicines are supplied.
6. Staff receives the consignment.
7. Staff confirms the received medicines.
8. Inventory is updated.
9. Admin can monitor the received order and updated stock.

---

## 🧩 Database

The application uses a relational database structure to maintain relationships between major entities such as:

```text
Users
  │
  ├── Admin
  ├── Pharmacist
  ├── Staff
  └── Supplier

Medicines
  │
  └── Suppliers
        │
        └── Supplier-Medicine Relationship

Purchase Orders
  │
  ├── Purchase Order Items
  ├── Supplier
  └── Receiving / Inventory

Dispensing
  │
  └── User who dispensed the medicine

Tasks
  │
  ├── Assigned by Admin/Pharmacist
  └── Assigned to Staff

Notifications
  │
  └── Relevant Users
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install Dependencies

Install the dependencies for the frontend and backend according to the project's folder structure.

```bash
npm install
```

If frontend and backend are separate applications, run `npm install` inside each respective directory.

### 3. Configure Environment Variables

Create the required `.env` files and configure your database connection and application settings.

Example:

```env
DATABASE_URL=your_database_connection
PORT=your_port
```

Do **not** commit `.env` files or credentials to GitHub.

### 4. Start the Application

For the frontend:

```bash
npm run dev
```

For the backend, use the start/development script defined in the backend `package.json`.

---

## 🔒 Security & Data Handling

- Role-based authorization restricts access to different system modules.
- Sensitive credentials should be stored in environment variables.
- Database credentials should never be committed to the repository.
- Users should only be allowed to perform operations permitted by their role.

---

## 🎯 Project Goals

MediStock was built to provide a structured digital solution for medical inventory operations by reducing manual inventory work and improving visibility into:

- Medicine stock
- Medicine expiry
- Procurement
- Suppliers
- Dispensing
- Staff tasks
- Inventory alerts
- Operational activities

---

## 🔮 Future Improvements

Potential future enhancements include:

- Barcode/QR-based medicine scanning
- Advanced inventory forecasting
- Automated stock replenishment
- More detailed audit logs
- Advanced reporting and export options
- Batch-wise inventory tracking improvements
- More advanced analytics
- Email notification customization
- Mobile-friendly/PWA support

---

## 👨‍💻 Developer

**Aryan Vatsa**

MediStock was developed as a full-stack project to build practical experience in modern web development, database design, REST APIs, authentication, role-based authorization, inventory workflows, and application architecture.
