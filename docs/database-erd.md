# ERD - RBAC Database Design

## Tables

### users
- id (PK)
- email (unique)

### modules
- id (PK)
- code (unique)
- name

### rights
- id (PK)
- code (unique)
- name

### user_rights
- user_id (FK → users.id)
- right_id (FK → rights.id)
- value (0/1)
- PRIMARY KEY (user_id, right_id)

---

## Relationships

users (1) ──── (M) user_rights (M) ──── (1) rights

modules = logical grouping of rights (no direct FK)

---

## Summary
RBAC system where users are assigned rights via junction table.