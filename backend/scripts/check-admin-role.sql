-- Check admin user role
SELECT id, name, email, role FROM users WHERE email = 'admin@eventpro.com';

-- Check all users with their roles
SELECT id, name, email, role FROM users;

-- Fix admin role if it's wrong
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@eventpro.com';

-- Verify the fix
SELECT id, name, email, role FROM users WHERE email = 'admin@eventpro.com';

