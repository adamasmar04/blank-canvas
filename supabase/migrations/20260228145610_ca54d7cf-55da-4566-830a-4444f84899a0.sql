
-- Upgrade user to super_admin
UPDATE public.user_roles 
SET role = 'super_admin' 
WHERE user_id = 'e94add82-d2da-478a-89dc-d6bae44cc519';
