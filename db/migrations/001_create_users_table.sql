-- SPRINT 1: PR-01 - Initial Schema & Customer Setup
-- Prepared by: M3 (Backend/Database Engineer)

-- 1. Create CUSTOMER Table (Modified with record_status and stamp)
CREATE TABLE customer (
    custno VARCHAR(10) PRIMARY KEY,
    custname VARCHAR(100) NOT NULL,
    address TEXT,
    payterm VARCHAR(10),
    -- Dagdag na columns base sa project requirements:
    record_status VARCHAR(10) DEFAULT 'ACTIVE' CHECK (record_status IN ('ACTIVE', 'INACTIVE')), [cite: 33]
    stamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP [cite: 33]
);

-- 2. Create PRODUCT Table
CREATE TABLE product (
    prodcode VARCHAR(20) PRIMARY KEY,
    description TEXT NOT NULL,
    unit VARCHAR(10)
);

-- 3. Create PRICEHIST Table
CREATE TABLE priceHist (
    prodcode VARCHAR(20) REFERENCES product(prodcode),
    effectivedate DATE,
    unitprice DECIMAL(10, 2),
    PRIMARY KEY (prodcode, effectivedate)
);

-- 4. Create SALES Table
CREATE TABLE sales (
    transno VARCHAR(20) PRIMARY KEY,
    salesdate DATE,
    custno VARCHAR(10) REFERENCES customer(custno),
    empno VARCHAR(10)
);

-- 5. Create SALESDETAIL Table
CREATE TABLE salesDetail (
    transno VARCHAR(20) REFERENCES sales(transno),
    prodcode VARCHAR(20) REFERENCES product(prodcode),
    quantity INT,
    PRIMARY KEY (transno, prodcode)
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE role_permissions (
  role_id INT,
  permission_id INT,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

