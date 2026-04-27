-- MODULES
CREATE TABLE IF NOT EXISTS modules (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL
);

-- RIGHTS
CREATE TABLE IF NOT EXISTS rights (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL
);

-- USERS
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL
);

-- USER RIGHTS
CREATE TABLE IF NOT EXISTS user_rights (
    user_id INT REFERENCES users(id),
    right_id INT REFERENCES rights(id),
    value INT DEFAULT 0,
    PRIMARY KEY (user_id, right_id)
);

INSERT INTO modules (code, name) VALUES
('CUST_MOD', 'Customer Module'),
('SALES_MOD', 'Sales Module'),
('PROD_MOD', 'Product Module'),
('ADM_MOD', 'Admin Module')
ON CONFLICT (code) DO NOTHING;

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

INSERT INTO users (email)
VALUES ('jcesperanza@neu.edu.ph')
ON CONFLICT (email) DO NOTHING;

INSERT INTO user_rights (user_id, right_id, value)
SELECT u.id, r.id, 1
FROM users u
CROSS JOIN rights r
WHERE u.email = 'jcesperanza@neu.edu.ph'
ON CONFLICT (user_id, right_id) DO NOTHING;

INSERT INTO modules (code, name) VALUES
('CUST_MOD', 'Customer Module'),
('SALES_MOD', 'Sales Module'),
('PROD_MOD', 'Product Module'),
('ADM_MOD', 'Admin Module');

INSERT INTO rights (code, description) VALUES
('CUST_VIEW', 'View Customers'),
('CUST_CREATE', 'Create Customers'),
('CUST_EDIT', 'Edit Customers'),

('SALES_VIEW', 'View Sales'),
('SALES_CREATE', 'Create Sales'),

('PROD_VIEW', 'View Products'),
('PROD_MANAGE', 'Manage Products'),

('ADM_USER', 'Manage Users'),
('ADM_SYSTEM', 'System Settings');

INSERT INTO users (email, role)
VALUES ('jcesperanza@neu.edu.ph', 'SUPERADMIN');

INSERT INTO user_rights (user_email, right_code, is_enabled)
VALUES
('jcesperanza@neu.edu.ph', 'CUST_VIEW', 1),
('jcesperanza@neu.edu.ph', 'CUST_CREATE', 1),
('jcesperanza@neu.edu.ph', 'CUST_EDIT', 1),

('jcesperanza@neu.edu.ph', 'SALES_VIEW', 1),
('jcesperanza@neu.edu.ph', 'SALES_CREATE', 1),

('jcesperanza@neu.edu.ph', 'PROD_VIEW', 1),
('jcesperanza@neu.edu.ph', 'PROD_MANAGE', 1),

('jcesperanza@neu.edu.ph', 'ADM_USER', 1),
('jcesperanza@neu.edu.ph', 'ADM_SYSTEM', 1);

-- roles
INSERT INTO roles (name) VALUES 
('admin'),
('user');

-- permissions
INSERT INTO permissions (name) VALUES 
('create_user'),
('edit_user'),
('delete_user'),
('view_user');

-- role_permissions (admin gets all)
INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4);