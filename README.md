# HopeCMS - Customer Management System

## 📌 Project Overview
HopeCMS is a Customer Management System developed for **Hope, Inc.** to manage customer data, sales history, and product catalogues[cite: 1, 2]. The system features a robust rights-based access control architecture, supporting **Superadmin**, **Admin**, and **User** roles with specific permissions for viewing and modifying data[cite: 33, 43].

**Prepared by:** JEREMIAS C. ESPERANZA [cite: 7]
**Institution:** New Era University – College of Informatics and Computer Studies [cite: 8]
**Academic Year:** 2025–2026 [cite: 9]

---

## 🛠 Tech Stack
* **Frontend:** Vite + React 18 + Tailwind CSS [cite: 31]
* **Routing:** React Router v6 [cite: 31]
* **Backend/Database:** Supabase [cite: 31, 33]
* **Authentication:** Email + Google OAuth [cite: 29, 34]
* **Testing:** Vitest + React Testing Library [cite: 35]

---

## 🚀 Getting Started

### Prerequisites
* Node.js installed
* A Supabase project created [cite: 33]
* Google Cloud Console configured for OAuth [cite: 34]

### Installation
1. **Clone the repository:**
   `git clone <your-repo-url>`
2. **Install dependencies:**
   `npm install`
3. **Environment Setup:**
   Create a .env file in the root directory based on .env.example[cite: 31, 35]:
   `VITE_SUPABASE_URL=your_supabase_url`
   `VITE_SUPABASE_ANON_KEY=your_supabase_anon_key`
4. **Run the development server:**
   `npm run dev` [cite: 35]

---

## 🌿 Git Workflow & Branching Strategy
To maintain stability, the project follows a strict flow: **feature branch → PR → dev → release PR → main**[cite: 16].

### Branch Naming Convention [cite: 57]
| Prefix | Usage | Example |
| :--- | :--- | :--- |
| feat/ | New feature (UI, API, context, view) | feat/ui-login-page |
| fix/ | Bug fix | fix/cust-visibility-rls |
| db/ | Database change (schema, RLS, view, trigger) | db/rls-customer-select |
| test/ | Test files | test/rights-27-cases |
| docs/ | Documentation | docs/user-manual |
| chore/ | Config, tooling, deployment | chore/vercel-deploy |

### PR Rules
* **Never merge directly into main**[cite: 16, 79].
* A PR counts only when reviewed by at least one teammate and merged into dev[cite: 14, 78].
* Merge target is always dev[cite: 16, 79].
* No console.log or .env files should be committed[cite: 76, 77].

---

## 🏗 System Architecture & Security
* **Authentication Guard:** Checks record_status = 'ACTIVE' on every sign-in event; inactive users are automatically signed out[cite: 34].
* **Soft Delete:** The system uses a record_status flag; hard DELETE statements are strictly prohibited[cite: 33, 52].
* **RLS (Row Level Security):**
    * USER roles see ACTIVE customers only[cite: 42].
    * Sales and Product tables are SELECT-only for all authenticated users[cite: 42].
    * SUPERADMIN accounts are protected and cannot be modified by ADMIN users[cite: 52, 53].

---

## 📅 Project Timeline
* **Sprint 1:** Project Setup, CMS Database Seeding, and Authentication[cite: 29].
* **Sprint 2:** Customer CRUD, Sales Views, and Rights Enforcement[cite: 38].
* **Sprint 3:** Admin Module, CMS Reports, and Production Deployment[cite: 48].