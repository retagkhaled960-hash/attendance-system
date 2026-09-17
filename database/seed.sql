BEGIN;

INSERT INTO departments (name, description)
VALUES
    ('Engineering', 'Software development and quality assurance'),
    ('Human Resources', 'People operations and recruitment'),
    ('Operations', 'Day-to-day business operations')
ON CONFLICT (name) DO NOTHING;


INSERT INTO users (username, email, password_hash, role, employee_code, department_id)
VALUES
    ('demo_admin', 'demo_admin@example.test', crypt('ChangeThisLocalDemoPassword!', gen_salt('bf', 12)), 'admin', 'ADM-001',
        (SELECT id FROM departments WHERE name = 'Engineering')),
    ('demo_manager', 'demo_manager@example.test', crypt('ChangeThisLocalDemoPassword!', gen_salt('bf', 12)), 'manager', 'MGR-001',
        (SELECT id FROM departments WHERE name = 'Human Resources')),
    ('demo_employee', 'demo_employee@example.test', crypt('ChangeThisLocalDemoPassword!', gen_salt('bf', 12)), 'employee', 'EMP-001',
        (SELECT id FROM departments WHERE name = 'Operations'))
ON CONFLICT (email) DO NOTHING;

INSERT INTO attendance (user_id, check_in_time, check_out_time, status)
SELECT id, NOW() - INTERVAL '2 days 8 hours', NOW() - INTERVAL '2 days', 'Present'
FROM users
WHERE email = 'demo_employee@example.test'
  AND NOT EXISTS (
      SELECT 1 FROM attendance
      WHERE user_id = users.id
        AND check_in_time::date = (NOW() - INTERVAL '2 days')::date
  );

COMMIT;
