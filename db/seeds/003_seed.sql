-- OPTIONAL: reset para malinis ulit
TRUNCATE customers, products, sales, sales_details, price_history RESTART IDENTITY CASCADE;

-- =========================
-- CUSTOMERS (82)
-- =========================
INSERT INTO customers (name, email)
SELECT 
    'Customer ' || i,
    'customer' || i || '@mail.com'
FROM generate_series(1, 82) AS s(i);

-- =========================
-- PRODUCTS (52)
-- =========================
INSERT INTO products (name, price)
SELECT 
    'Product ' || i,
    (RANDOM() * 1000)::INT
FROM generate_series(1, 52) AS s(i);

-- =========================
-- SALES (124)
-- =========================
INSERT INTO sales (customer_id, total)
SELECT 
    (RANDOM() * 81 + 1)::INT,
    (RANDOM() * 5000)::INT
FROM generate_series(1, 124);

-- =========================
-- SALES DETAILS (~250)
-- =========================
INSERT INTO sales_details (sale_id, product_id, quantity)
SELECT 
    (RANDOM() * 123 + 1)::INT,
    (RANDOM() * 51 + 1)::INT,
    (RANDOM() * 10 + 1)::INT
FROM generate_series(1, 250);

-- =========================
-- PRICE HISTORY (~70)
-- =========================
INSERT INTO price_history (product_id, price, changed_at)
SELECT 
    (RANDOM() * 51 + 1)::INT,
    (RANDOM() * 1000)::INT,
    NOW() - (RANDOM() * INTERVAL '30 days')
FROM generate_series(1, 70);