# 🚀 Pull Request Template

## 📝 Description
- **Summary of changes:** - **Motivation/Context:** - **Implementation details:** ---

## 🛠 Type of Change
[cite_start]*Check the relevant box based on the project naming convention[cite: 57]:*

- [ ] `feat/`: New feature (UI, API, context, view)
- [ ] `fix/`: Bug fix 
- [ ] `db/`: Database change (schema, RLS, view, trigger)
- [ ] `test/`: New or updated tests
- [ ] `docs/`: Documentation updates
- [ ] `refactor/`: Code cleanup (no behavior change)
- [ ] `chore/`: Config, tooling, or deployment

---

## 🧪 Testing & Verification
- [ ] [cite_start]All Vitest tests passed locally[cite: 75].
- [ ] (For `db/` PRs) [cite_start]Verification query included/executed to show expected output[cite: 21].
- [ ] Manual verification performed (Describe steps): 

---

## ✅ PR Checklist
[cite_start]*Review these items before requesting a review [cite: 70-80].*

- [ ] [cite_start]**Branching:** Forked from `dev` and follows `prefix/branch-name` convention[cite: 71, 72].
- [ ] [cite_start]**Title:** PR title is in imperative mood and specific (e.g., 'Add SELECT-only RLS...')[cite: 73].
- [ ] [cite_start]**Target:** Merge target is `dev`, never `main`[cite: 79, 16].
- [ ] [cite_start]**Clean Code:** No `console.log` statements remaining[cite: 76].
- [ ] [cite_start]**Security:** No `.env` files or Supabase keys are committed[cite: 77].
- [ ] [cite_start]**Review:** At least one team member has reviewed and approved[cite: 78, 14].

---

## 📸 Media / Evidence (Optional)