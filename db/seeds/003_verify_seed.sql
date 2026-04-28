-- =========================
-- ROW COUNT CHECK
-- =========================
SELECT 'customers' AS table_name, COUNT(*) FROM customers
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'sales', COUNT(*) FROM sales
UNION ALL
SELECT 'sales_details', COUNT(*) FROM sales_details
UNION ALL
SELECT 'price_history', COUNT(*) FROM price_history;
-- =========================
-- FK VALIDATION
-- =========================

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