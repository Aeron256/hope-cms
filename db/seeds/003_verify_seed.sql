-- =========================
-- DATA SEEDING
-- =========================

-- CUSTOMERS (82)
INSERT INTO customers (name, email)
SELECT 
  'Customer ' || g,
  'customer' || g || '@mail.com'
FROM generate_series(1,82) g;

-- PRODUCTS (52)
INSERT INTO products (name, price)
SELECT 
  'Product ' || g,
  (random() * 1000)::int
FROM generate_series(1,52) g;

-- SALES (124)
INSERT INTO sales (customer_id, total)
SELECT 
  floor(random() * 82 + 1)::int,
  (random() * 5000)::int
FROM generate_series(1,124);

-- SALES DETAILS (~250)
INSERT INTO sales_details (sale_id, product_id, quantity)
SELECT 
  floor(random() * 124 + 1)::int,
  floor(random() * 52 + 1)::int,
  floor(random() * 5 + 1)::int
FROM generate_series(1,250);

-- PRICE HISTORY (~70)
INSERT INTO price_history (product_id, price)
SELECT 
  floor(random() * 52 + 1)::int,
  (random() * 1000)::int
FROM generate_series(1,70);


-- =========================
-- VERIFICATION
-- =========================

-- ROW COUNTS
SELECT 'customers' AS table_name, COUNT(*) FROM customers
UNION ALL
SELECT 'sales', COUNT(*) FROM sales
UNION ALL
SELECT 'sales_details', COUNT(*) FROM sales_details
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'price_history', COUNT(*) FROM price_history;

-- FK CHECKS

-- sales → customers
SELECT *
FROM sales s
LEFT JOIN customers c ON s.customer_id = c.id
WHERE c.id IS NULL;

-- sales_details → sales
SELECT *
FROM sales_details sd
LEFT JOIN sales s ON sd.sale_id = s.id
WHERE s.id IS NULL;

-- sales_details → products
SELECT *
FROM sales_details sd
LEFT JOIN products p ON sd.product_id = p.id
WHERE p.id IS NULL;

-- price_history → products
SELECT *
FROM price_history ph
LEFT JOIN products p ON ph.product_id = p.id
WHERE p.id IS NULL;