BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS departments (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(200),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'employee'
        CHECK (role IN ('admin', 'manager', 'employee')),
    employee_code VARCHAR(50) UNIQUE,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    check_in_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    check_out_time TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'Present',
    CONSTRAINT valid_attendance_times
        CHECK (check_out_time IS NULL OR check_out_time >= check_in_time)
);

CREATE INDEX IF NOT EXISTS attendance_user_id_idx ON attendance(user_id);
CREATE INDEX IF NOT EXISTS attendance_check_in_time_idx ON attendance(check_in_time DESC);


CREATE UNIQUE INDEX IF NOT EXISTS one_open_attendance_per_user_idx
    ON attendance(user_id)
    WHERE check_out_time IS NULL;

COMMIT;
