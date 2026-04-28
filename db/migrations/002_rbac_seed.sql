-- =========================
-- TABLES
-- =========================

CREATE TABLE IF NOT EXISTS modules (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS rights (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS user_rights (
    user_id INT REFERENCES users(id),
    right_id INT REFERENCES rights(id),
    value INT DEFAULT 0,
    PRIMARY KEY (user_id, right_id)
);

-- =========================
-- SEED DATA
-- =========================

-- MODULES
INSERT INTO modules (code, name) VALUES
('CUST_MOD', 'Customer Module'),
('SALES_MOD', 'Sales Module'),
('PROD_MOD', 'Product Module'),
('ADM_MOD', 'Admin Module')
ON CONFLICT (code) DO NOTHING;

-- RIGHTS (9)
INSERT INTO rights (code, name) VALUES
('CUST_VIEW', 'View Customers'),
('CUST_EDIT', 'Edit Customers'),
('SALES_VIEW', 'View Sales'),
('SALES_EDIT', 'Edit Sales'),
('PROD_VIEW', 'View Products'),
('PROD_EDIT', 'Edit Products'),
('ADM_USER', 'Manage Users'),
('ADM_ROLE', 'Manage Roles'),
('ADM_SETTINGS', 'Manage Settings')
ON CONFLICT (code) DO NOTHING;

-- USER
INSERT INTO users (email)
VALUES ('jcesperanza@neu.edu.ph')
ON CONFLICT (email) DO NOTHING;

-- GIVE ALL RIGHTS
INSERT INTO user_rights (user_id, right_id, value)
SELECT u.id, r.id, 1
FROM users u
CROSS JOIN rights r
WHERE u.email = 'jcesperanza@neu.edu.ph'
ON CONFLICT (user_id, right_id) DO NOTHING;