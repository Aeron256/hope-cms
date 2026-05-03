-- ==========================================
-- PR-04: Database Verification Queries
-- ==========================================

-- 1. Verify Core HopeDB Table Row Counts
SELECT 'customer' AS table_name, COUNT(*) FROM public.customer
UNION ALL
SELECT 'sales', COUNT(*) FROM public.sales
UNION ALL
SELECT 'salesDetail', COUNT(*) FROM public.salesdetail
UNION ALL
SELECT 'product', COUNT(*) FROM public.product
UNION ALL
SELECT 'priceHist', COUNT(*) FROM public.pricehist;

-- 2. Verify Rights Management Seeding
SELECT 'modules' AS table_name, COUNT(*) FROM public."Module"
UNION ALL
SELECT 'rights', COUNT(*) FROM public.rights;

-- 3. Verify SUPERADMIN Setup
-- Checks if the admin has exactly 9 rights assigned
SELECT 
    u.email, 
    count(ur.right_id) as total_rights
FROM auth.users u
JOIN public."UserModule_Rights" ur ON u.id = ur.user_id
WHERE u.email = 'jcesperanza@neu.edu.ph'
GROUP BY u.email;

-- 4. Verify Customer Table Modifications (PR-01 requirement)
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'customer' 
AND column_name IN ('record_status', 'stamp');