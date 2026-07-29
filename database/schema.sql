-- ROLES
CREATE TABLE Roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(30) UNIQUE NOT NULL,
    description VARCHAR(255)
);

-- USERS
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role_id INTEGER REFERENCES Roles(role_id),
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CATEGORIES
CREATE TABLE Categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);

-- SUPPLIERS
CREATE TABLE Suppliers (
    supplier_id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(15),
    email VARCHAR(100),
    address TEXT,
    status BOOLEAN DEFAULT TRUE
);

-- MEDICINES
CREATE TABLE Medicines (
    medicine_id SERIAL PRIMARY KEY,
    medicine_name VARCHAR(100) NOT NULL,
    batch_number VARCHAR(50) UNIQUE,
    category_id INTEGER REFERENCES Categories(category_id),
    supplier_id INTEGER REFERENCES Suppliers(supplier_id),
    dosage VARCHAR(50),
    unit VARCHAR(20),
    manufacture_date DATE,
    expiry_date DATE,
    unit_price DECIMAL(10,2),
    description TEXT
);

-- INVENTORY
CREATE TABLE Inventory (
    inventory_id SERIAL PRIMARY KEY,
    medicine_id INTEGER UNIQUE REFERENCES Medicines(medicine_id),
    quantity INTEGER DEFAULT 0,
    minimum_stock INTEGER DEFAULT 10,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- STOCK LOGS
CREATE TABLE StockLogs (
    stock_log_id SERIAL PRIMARY KEY,
    medicine_id INTEGER REFERENCES Medicines(medicine_id),
    user_id INTEGER REFERENCES Users(user_id),
    action VARCHAR(50),
    old_quantity INTEGER,
    new_quantity INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PURCHASE ORDERS
CREATE TABLE PurchaseOrders (
    purchase_order_id SERIAL PRIMARY KEY,
    supplier_id INTEGER REFERENCES Suppliers(supplier_id),
    ordered_by INTEGER REFERENCES Users(user_id),
    order_date DATE,
    total_amount DECIMAL(10,2),
    status VARCHAR(30)
);

-- PURCHASE ORDER ITEMS
CREATE TABLE PurchaseOrderItems (
    item_id SERIAL PRIMARY KEY,
    purchase_order_id INTEGER REFERENCES PurchaseOrders(purchase_order_id),
    medicine_id INTEGER REFERENCES Medicines(medicine_id),
    quantity INTEGER,
    unit_price DECIMAL(10,2)
);

-- EXPIRY TRACKING
CREATE TABLE ExpiryTracking (
    expiry_id SERIAL PRIMARY KEY,
    medicine_id INTEGER REFERENCES Medicines(medicine_id),
    expiry_date DATE,
    status VARCHAR(30),
    notification_sent BOOLEAN DEFAULT FALSE
);

-- NOTIFICATIONS
CREATE TABLE Notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id),
    title VARCHAR(100),
    message TEXT,
    type VARCHAR(30),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- REPORTS
CREATE TABLE Reports (
    report_id SERIAL PRIMARY KEY,
    report_name VARCHAR(100),
    generated_by INTEGER REFERENCES Users(user_id),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    report_type VARCHAR(50),
    file_path TEXT
);