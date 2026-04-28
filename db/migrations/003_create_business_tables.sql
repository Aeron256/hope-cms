-- =========================
-- RESET TABLES (SAFE FIX)
-- =========================
DROP TABLE IF EXISTS sales_details CASCADE;
DROP TABLE IF EXISTS price_history CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- =========================
-- CUSTOMERS
-- =========================
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

-- =========================
-- PRODUCTS
-- =========================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    price INT
);

-- =========================
-- SALES
-- =========================
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    customer_id INT,
    total INT,
    CONSTRAINT fk_customer
        FOREIGN KEY(customer_id)
        REFERENCES customers(id)
);

-- =========================
-- SALES DETAILS
-- =========================
CREATE TABLE sales_details (
    id SERIAL PRIMARY KEY,
    sale_id INT,
    product_id INT,
    quantity INT,
    CONSTRAINT fk_sale
        FOREIGN KEY(sale_id)
        REFERENCES sales(id),
    CONSTRAINT fk_product
        FOREIGN KEY(product_id)
        REFERENCES products(id)
);

-- =========================
-- PRICE HISTORY
-- =========================
CREATE TABLE price_history (
    id SERIAL PRIMARY KEY,
    product_id INT,
    price INT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_price
        FOREIGN KEY(product_id)
        REFERENCES products(id)
);