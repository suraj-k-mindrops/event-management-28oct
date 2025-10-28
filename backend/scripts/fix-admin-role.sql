-- Fix admin user role
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@eventpro.com';

-- Verify the update
SELECT id, name, email, role FROM users WHERE email = 'admin@eventpro.com';

