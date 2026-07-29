-- =====================================================
-- MEDISTOCK DATABASE SCHEMA
-- Part 1
-- =====================================================

DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS expiry_tracking;
DROP TABLE IF EXISTS purchase_orders;
DROP TABLE IF EXISTS stock_logs;
DROP TABLE IF EXISTS medicines;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- =====================================================
-- ROLES
-- =====================================================

CREATE TABLE roles(

    id BIGSERIAL PRIMARY KEY,

    role_name VARCHAR(30) UNIQUE NOT NULL

);

-- =====================================================
-- USERS
-- =====================================================

CREATE TABLE users(

    id BIGSERIAL PRIMARY KEY,

    username VARCHAR(50) UNIQUE NOT NULL,

    email VARCHAR(120) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    full_name VARCHAR(100),

    phone VARCHAR(20),

    otp VARCHAR(10),

    role_id BIGINT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_role
    FOREIGN KEY(role_id)
    REFERENCES roles(id)

);

-- =====================================================
-- SUPPLIERS
-- =====================================================

CREATE TABLE suppliers(

    id BIGSERIAL PRIMARY KEY,

    supplier_name VARCHAR(120) NOT NULL,

    contact_number VARCHAR(20),

    email VARCHAR(120),

    address TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =====================================================
-- MEDICINES
-- =====================================================

CREATE TABLE medicines(

    id BIGSERIAL PRIMARY KEY,

    name VARCHAR(150) NOT NULL,

    batch_number VARCHAR(60) UNIQUE NOT NULL,

    category VARCHAR(60) NOT NULL,

    supplier VARCHAR(120),

    manufacturer VARCHAR(120),

    quantity INT DEFAULT 0,

    price DECIMAL(10,2) NOT NULL,

    selling_price DECIMAL(10,2) DEFAULT 0,

    min_stock_level INT DEFAULT 10,

    expiry_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
-- =====================================================
-- MEDISTOCK DATABASE SCHEMA
-- Part 2
-- =====================================================


-- =====================================================
-- STOCK LOGS
-- Tracks every inventory change
-- =====================================================

CREATE TABLE stock_logs(

    id BIGSERIAL PRIMARY KEY,

    medicine_id BIGINT NOT NULL,

    operation VARCHAR(30) NOT NULL,

    old_quantity INT,

    new_quantity INT,

    quantity_changed INT,

    performed_by BIGINT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_stock_medicine

    FOREIGN KEY(medicine_id)

    REFERENCES medicines(id),


    CONSTRAINT fk_stock_user

    FOREIGN KEY(performed_by)

    REFERENCES users(id)

);



-- =====================================================
-- PURCHASE ORDERS
-- Supplier purchase tracking
-- =====================================================


CREATE TABLE purchase_orders(

    id BIGSERIAL PRIMARY KEY,


    supplier_id BIGINT NOT NULL,


    order_date DATE DEFAULT CURRENT_DATE,


    total_amount DECIMAL(10,2),


    status VARCHAR(30)
    DEFAULT 'PENDING',



    CONSTRAINT fk_purchase_supplier

    FOREIGN KEY(supplier_id)

    REFERENCES suppliers(id)

);



-- =====================================================
-- PURCHASE ORDER ITEMS
-- Multiple medicines in one order
-- =====================================================


CREATE TABLE purchase_order_items(

    id BIGSERIAL PRIMARY KEY,


    purchase_order_id BIGINT NOT NULL,


    medicine_id BIGINT NOT NULL,


    quantity INT NOT NULL,


    price DECIMAL(10,2),



    CONSTRAINT fk_order_item_order

    FOREIGN KEY(purchase_order_id)

    REFERENCES purchase_orders(id),



    CONSTRAINT fk_order_item_medicine

    FOREIGN KEY(medicine_id)

    REFERENCES medicines(id)

);



-- =====================================================
-- EXPIRY TRACKING
-- Medicine expiry monitoring
-- =====================================================


CREATE TABLE expiry_tracking(

    id BIGSERIAL PRIMARY KEY,


    medicine_id BIGINT UNIQUE NOT NULL,


    expiry_date DATE NOT NULL,


    days_remaining INT,


    status VARCHAR(30),


    notification_sent BOOLEAN DEFAULT FALSE,


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,



    CONSTRAINT fk_expiry_medicine

    FOREIGN KEY(medicine_id)

    REFERENCES medicines(id)

);



-- =====================================================
-- NOTIFICATIONS
-- System alerts
-- =====================================================


CREATE TABLE notifications(

    id BIGSERIAL PRIMARY KEY,


    user_id BIGINT,


    title VARCHAR(200),


    message TEXT,


    notification_type VARCHAR(50),


    is_read BOOLEAN DEFAULT FALSE,


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,



    CONSTRAINT fk_notification_user

    FOREIGN KEY(user_id)

    REFERENCES users(id)

);



-- =====================================================
-- REPORTS
-- Generated reports history
-- =====================================================


CREATE TABLE reports(

    id BIGSERIAL PRIMARY KEY,


    report_name VARCHAR(150),


    report_type VARCHAR(50),


    generated_by BIGINT,


    file_path TEXT,


    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,



    CONSTRAINT fk_report_user

    FOREIGN KEY(generated_by)

    REFERENCES users(id)

);